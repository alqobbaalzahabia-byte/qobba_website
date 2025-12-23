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

const reviewSchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  feedbackEn: z.string().min(10, 'English feedback must be at least 10 characters'),
  feedbackAr: z.string().min(10, 'Arabic feedback must be at least 10 characters'),
})

export default function EditReviewModal({ review, isOpen, onClose, onSave, lng }) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [isApproved, setIsApproved] = useState(false)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      nameEn: '',
      nameAr: '',
      feedbackEn: '',
      feedbackAr: '',
    },
  })

  useEffect(() => {
    if (review && isOpen) {
      const imageUrl = review.image || ''
      setValue('nameEn', review.name.en || '')
      setValue('nameAr', review.name.ar || '')
      setValue('feedbackEn', review.feedback.en || '')
      setValue('feedbackAr', review.feedback.ar || '')
      
      setImageUrl(imageUrl)
      setImagePreview(imageUrl)
      setSelectedFile(null)
      setIsApproved(review.is_approved || false)
    }
  }, [review, isOpen, setValue])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
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
      const fileName = `${review.id}_${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('testimonials')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      let imageUrl = ''

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
        
        imageUrl = urlData.publicUrl
      } else {
        const { data: urlData } = supabase.storage
          .from('testimonials')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

      setImageUrl(imageUrl)
      setSelectedFile(null)
      return imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
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
      
      const formData = {
        name: {
          en: data.nameEn,
          ar: data.nameAr || ''
        },
        feedback: {
          en: data.feedbackEn || '',
          ar: data.feedbackAr || ''
        },
        image: finalImageUrl,
        is_approved: isApproved
      }

      await onSave(review.id, formData)
      
      toast.success(
        lng === 'ar' 
          ? 'تم تحديث المراجعة بنجاح!' 
          : 'Review updated successfully!'
      )
      
      onClose()
    } catch (error) {
      console.error('Error saving review:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل تحديث المراجعة. يرجى المحاولة مرة أخرى.' 
          : 'Failed to update review. Please try again.'
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Review</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Approval Status Toggle */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-900">Review Status</span>
                <p className="text-xs text-gray-500 mt-1">
                  {isApproved ? 'This review is visible to customers' : 'This review is hidden from customers'}
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Photo
            </label>
            
            {imagePreview && (
              <div className="mb-4 flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 upload-image-input">
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
                  {selectedFile ? 'Change Photo' : 'Choose Photo'}
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
            id="nameEn"
            type="text"
            label="Customer Name (English) *"
            placeholder="Full name in English"
            error={errors.nameEn?.message}
            {...register('nameEn')}
          />

          <Input
            id="nameAr"
            type="text"
            label="Customer Name (Arabic) *"
            placeholder="الاسم الكامل بالعربية"
            error={errors.nameAr?.message}
            dir="rtl"
            {...register('nameAr')}
          />

          <Input
            id="feedbackEn"
            type="textarea"
            label="Feedback (English) *"
            placeholder="Customer feedback in English"
            error={errors.feedbackEn?.message}
            rows={4}
            {...register('feedbackEn')}
          />

          <Input
            id="feedbackAr"
            type="textarea"
            label="Feedback (Arabic) *"
            placeholder="تعليقات العميل بالعربية"
            error={errors.feedbackAr?.message}
            rows={4}
            dir="rtl"
            {...register('feedbackAr')}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-[#FAB000] hover:bg-[#E19F00] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || uploading}
            >
              {uploading ? 'Uploading Photo...' : loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}