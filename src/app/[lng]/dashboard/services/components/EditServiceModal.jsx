'use client'

import { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

export default function EditServiceModal({ service, isOpen, onClose, onSave, lng }) {
  const [formData, setFormData] = useState({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    image: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (service && isOpen) {
      // Initialize form with service data
      setFormData({
        title: typeof service.title === 'object' ? service.title : { en: service.title || '', ar: '' },
        description: typeof service.description === 'object' ? service.description : { en: service.description || '', ar: '' },
        image: service.image || ''
      })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(service.id, formData)
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
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAB000] focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

