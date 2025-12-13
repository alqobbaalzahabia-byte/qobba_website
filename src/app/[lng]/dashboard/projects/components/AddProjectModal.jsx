'use client'

import { useState, useRef } from 'react'
import { FiX, FiUpload } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import { toast } from 'react-toastify'

const projectSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionAr: z.string().min(1, 'Arabic description is required'),
})

export default function AddProjectModal({ isOpen, onClose, onAdd, lng }) {
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
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
    },
  })

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
      const fileName = `projects/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('projects')
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
          .from('projects')
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
        title: {
          en: data.titleEn,
          ar: data.titleAr || ''
        },
        description: {
          en: data.descriptionEn || '',
          ar: data.descriptionAr || ''
        },
        image: finalImageUrl
      }

      await onAdd(formData)
      
      toast.success(
        lng === 'ar' 
          ? 'تم إنشاء المشروع بنجاح!' 
          : 'Project created successfully!'
      )
      
      reset()
      setImagePreview('')
      setSelectedFile(null)
      setImageUrl('')
      
      onClose()
    } catch (error) {
      console.error('Error adding project:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل إنشاء المشروع. يرجى المحاولة مرة أخرى.' 
          : 'Failed to create project. Please try again.'
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
          <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Image *
            </label>
            
            {imagePreview && (
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
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
                  {selectedFile ? 'Change Image' : 'Choose Image'}
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
            label="Title (English) *"
            placeholder="Project title in English"
            error={errors.titleEn?.message}
            {...register('titleEn')}
          />

          <Input
            id="titleAr"
            type="text"
            label="Title (Arabic) *"
            placeholder="عنوان المشروع بالعربية"
            error={errors.titleAr?.message}
            dir="rtl"
            {...register('titleAr')}
          />

          <Input
            id="descriptionEn"
            type="textarea"
            label="Description (English) *"
            placeholder="Project description in English"
            error={errors.descriptionEn?.message}
            rows={4}
            {...register('descriptionEn')}
          />

          <Input
            id="descriptionAr"
            type="textarea"
            label="Description (Arabic) *"
            placeholder="وصف المشروع بالعربية"
            error={errors.descriptionAr?.message}
            rows={4}
            dir="rtl"
            {...register('descriptionAr')}
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
              {uploading ? 'Uploading Image...' : loading ? 'Adding...' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}