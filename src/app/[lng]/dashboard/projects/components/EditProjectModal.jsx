'use client'

import { useState, useEffect, useRef } from 'react'
import { FiX, FiUpload, FiImage } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function EditProjectModal({ project, isOpen, onClose, onSave, lng }) {
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
    if (project && isOpen) {
      const imageUrl = project.image || ''
      setFormData({
        title: typeof project.title === 'object' ? project.title : { en: project.title || '', ar: '' },
        description: typeof project.description === 'object' ? project.description : { en: project.description || '', ar: '' },
        image: imageUrl
      })
      setImagePreview(imageUrl)
      setSelectedFile(null)
    }
  }, [project, isOpen])

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
      const fileName = `projects/${project.id}_${Date.now()}.${fileExt}`
      
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
      
      if (selectedFile) {
        const imageUrl = await handleImageUpload()
        if (imageUrl) {
          finalFormData = { ...finalFormData, image: imageUrl }
        }
      }
      
      await onSave(project.id, finalFormData)
      onClose()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Image
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (English)
            </label>
            <input
              type="text"
              value={formData.title.en}
              onChange={(e) => handleChange('title', e.target.value, 'en')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent"
              placeholder="Project title in English"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Arabic)
            </label>
            <input
              type="text"
              value={formData.title.ar}
              onChange={(e) => handleChange('title', e.target.value, 'ar')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent"
              placeholder="عنوان المشروع بالعربية"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English)
            </label>
            <textarea
              value={formData.description.en}
              onChange={(e) => handleChange('description', e.target.value, 'en')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent resize-none"
              placeholder="Project description in English"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Arabic)
            </label>
            <textarea
              value={formData.description.ar}
              onChange={(e) => handleChange('description', e.target.value, 'ar')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent resize-none"
              placeholder="وصف المشروع بالعربية"
              dir="rtl"
            />
          </div>

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