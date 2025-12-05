'use client'

import { useState, useEffect, useRef } from 'react'
import { FiX, FiUpload, FiImage } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function EditServiceModal({ service, isOpen, onClose, onSave, lng }) {
  const [formData, setFormData] = useState({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (service && isOpen) {
      // Initialize form with service data
      const imageUrl = service.image || ''
      setFormData({
        title: typeof service.title === 'object' ? service.title : { en: service.title || '', ar: '' },
        description: typeof service.description === 'object' ? service.description : { en: service.description || '', ar: '' },
        image: imageUrl
      })
      setImagePreview(imageUrl)
      setSelectedFile(null)
    }
  }, [service, isOpen])

  const handleChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setSelectedFile(file)
      
      // Create preview
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
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${service.id}_${Date.now()}.${fileExt}`
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('services')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      let imageUrl = ''

      if (uploadError) {
        // If bucket doesn't exist or upload fails, try 'images' bucket
        const { data: altUploadData, error: altUploadError } = await supabase.storage
          .from('images')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (altUploadError) {
          throw altUploadError
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName)
        
        imageUrl = urlData.publicUrl
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('services')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

      setFormData(prev => ({ ...prev, image: imageUrl }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    
    try {
      let finalFormData = { ...formData }
      
      // Upload image first if a new file is selected
      if (selectedFile) {
        const imageUrl = await handleImageUpload()
        if (imageUrl) {
          finalFormData = { ...finalFormData, image: imageUrl }
        }
      }
      
      await onSave(service.id, finalFormData)
      onClose()
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Image
            </label>
            
            {/* Image Preview */}
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

            {/* File Input */}
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
                  {selectedFile ? 'Change Image' : 'Choose Image'}
                </button>
                
                {selectedFile && (
                  <span className="text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                )}
              </div>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FAB000] text-white rounded-lg hover:bg-[#E19F00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiImage className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              )}
            </div>
          </div>

          {/* Title - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (English)
            </label>
            <input
              type="text"
              value={formData.title.en}
              onChange={(e) => handleChange('title', e.target.value, 'en')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent"
              placeholder="Service title in English"
              required
            />
          </div>

          {/* Title - Arabic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Arabic)
            </label>
            <input
              type="text"
              value={formData.title.ar}
              onChange={(e) => handleChange('title', e.target.value, 'ar')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent"
              placeholder="عنوان الخدمة بالعربية"
              dir="rtl"
            />
          </div>

          {/* Description - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English)
            </label>
            <textarea
              value={formData.description.en}
              onChange={(e) => handleChange('description', e.target.value, 'en')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent resize-none"
              placeholder="Service description in English"
            />
          </div>

          {/* Description - Arabic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Arabic)
            </label>
            <textarea
              value={formData.description.ar}
              onChange={(e) => handleChange('description', e.target.value, 'ar')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent resize-none"
              placeholder="وصف الخدمة بالعربية"
              dir="rtl"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
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
              {uploading ? 'Uploading Image...' : loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

