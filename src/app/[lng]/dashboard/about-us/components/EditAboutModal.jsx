'use client'

import { useState, useEffect, useRef } from 'react'
import { FiX, FiUpload } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import { toast } from 'react-toastify'

const aboutSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionAr: z.string().min(1, 'Arabic description is required'),
})

export default function EditAboutModal({ aboutData, isOpen, onClose, onSave, lng }) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (aboutData) {
        setValue('titleEn', aboutData.title?.en || '')
        setValue('titleAr', aboutData.title?.ar || '')
        setValue('descriptionEn', aboutData.description?.en || '')
        setValue('descriptionAr', aboutData.description?.ar || '')
        
        const imageUrl = aboutData.image || ''
        setImageUrl(imageUrl)
        setImagePreview(imageUrl)
      }
      setSelectedFile(null)
    }
  }, [aboutData, isOpen, setValue])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(
          lng === 'ar' 
            ? 'يرجى اختيار ملف صورة' 
            : 'Please select an image file'
        )
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          lng === 'ar' 
            ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' 
            : 'Image size should be less than 5MB'
        )
        return
      }

      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    if (!selectedFile) return null

    setUploading(true)
    try {
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `about_${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('about')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      let uploadedImageUrl = ''

      if (uploadError) {
        const { data: altUploadData, error: altUploadError } = await supabase.storage
          .from('images')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (altUploadError) {
          throw altUploadError
        }

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName)
        
        uploadedImageUrl = urlData.publicUrl
      } else {
        const { data: urlData } = supabase.storage
          .from('about')
          .getPublicUrl(fileName)

        uploadedImageUrl = urlData.publicUrl
      }

      setImageUrl(uploadedImageUrl)
      setSelectedFile(null)
      return uploadedImageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل رفع الصورة. يرجى المحاولة مرة أخرى.' 
          : 'Failed to upload image. Please try again.'
      )
      throw error
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      let finalImageUrl = imageUrl
      
      if (selectedFile) {
        const uploadedUrl = await handleImageUpload()
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl
        }
      }

      if (!finalImageUrl) {
        toast.error(
          lng === 'ar' 
            ? 'الصورة مطلوبة' 
            : 'Image is required'
        )
        setLoading(false)
        return
      }
      
      const formData = {
        title: {
          en: data.titleEn,
          ar: data.titleAr
        },
        description: {
          en: data.descriptionEn,
          ar: data.descriptionAr
        },
        image: finalImageUrl
      }

      await onSave(formData)
      
      toast.success(
        lng === 'ar' 
          ? 'تم حفظ البيانات بنجاح!' 
          : 'Data saved successfully!'
      )
      
      handleClose()
    } catch (error) {
      console.error('Error saving about data:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل حفظ البيانات. يرجى المحاولة مرة أخرى.' 
          : 'Failed to save data. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setImagePreview('')
    setSelectedFile(null)
    setImageUrl('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {lng === 'ar' ? 'تعديل من نحن' : 'Edit About Us'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {lng === 'ar' ? 'الصورة *' : 'Image *'}
            </label>
            
            {imagePreview && (
              <div className="mb-4 relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <FiUpload className="w-4 h-4" />
                  {selectedFile 
                    ? (lng === 'ar' ? 'تغيير الصورة' : 'Change Image')
                    : (lng === 'ar' ? 'اختر صورة' : 'Choose Image')
                  }
                </button>
                
                {selectedFile && (
                  <span className="text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Input
            id="titleEn"
            type="text"
            label={lng === 'ar' ? 'العنوان (إنجليزي) *' : 'Title (English) *'}
            placeholder="Enter English title"
            error={errors.titleEn?.message}
            {...register('titleEn')}
          />

          <Input
            id="titleAr"
            type="text"
            label={lng === 'ar' ? 'العنوان (عربي) *' : 'Title (Arabic) *'}
            placeholder="أدخل العنوان بالعربية"
            error={errors.titleAr?.message}
            dir="rtl"
            {...register('titleAr')}
          />

          <Input
            id="descriptionEn"
            type="textarea"
            label={lng === 'ar' ? 'الوصف (إنجليزي) *' : 'Description (English) *'}
            placeholder="Enter English description"
            error={errors.descriptionEn?.message}
            rows={6}
            {...register('descriptionEn')}
          />

          <Input
            id="descriptionAr"
            type="textarea"
            label={lng === 'ar' ? 'الوصف (عربي) *' : 'Description (Arabic) *'}
            placeholder="أدخل الوصف بالعربية"
            error={errors.descriptionAr?.message}
            rows={6}
            dir="rtl"
            {...register('descriptionAr')}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              {lng === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-[#FAB000] hover:bg-[#E19F00] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || uploading}
            >
              {uploading 
                ? (lng === 'ar' ? 'جاري رفع الصورة...' : 'Uploading Image...') 
                : loading 
                  ? (lng === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                  : (lng === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
