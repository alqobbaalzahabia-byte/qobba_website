'use client'

import { useState } from 'react'
import { insertService } from '@/app/[lng]/contact/actions'
import Button from '../../../components/ui/Button'

export default function ServiceForm({ lng }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData(e.target)
    
    try {
      const result = await insertService(formData)
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Service added successfully!' })
        e.target.reset()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add service' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-[#572b0a] mb-6">Add New Service</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image URL */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-[#572b0a] mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Title - Arabic */}
        <div>
          <label htmlFor="titleAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Title (Arabic)
          </label>
          <input
            type="text"
            id="titleAr"
            name="titleAr"
            
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="العنوان بالعربية"
          />
        </div>

        {/* Title - English */}
        <div>
          <label htmlFor="titleEn" className="block text-sm font-medium text-[#572b0a] mb-2">
            Title (English)
          </label>
          <input
            type="text"
            id="titleEn"
            name="titleEn"
            
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="Title in English"
          />
        </div>

        {/* Description - Arabic */}
        <div>
          <label htmlFor="descriptionAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Description (Arabic)
          </label>
          <textarea
            id="descriptionAr"
            name="descriptionAr"
            
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="الوصف بالعربية"
          />
        </div>

        {/* Description - English */}
        <div>
          <label htmlFor="descriptionEn" className="block text-sm font-medium text-[#572b0a] mb-2">
            Description (English)
          </label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="Description in English"
          />
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#572b0a] text-white py-3 px-6 rounded-lg hover:bg-[#6b3512] font-medium"
        >
          {loading ? 'Adding...' : 'Add Service'}
        </Button>
      </form>
    </div>
  )
}

