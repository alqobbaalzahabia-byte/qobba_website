'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Button from '../../../components/ui/Button'

export default function AboutUsForm({ lng }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData(e.target)
    const titleAr = formData.get('titleAr')
    const titleEn = formData.get('titleEn')
    const descAr = formData.get('descriptionAr')
    const descEn = formData.get('descriptionEn')
    const imageFile = formData.get('imageFile')
    const imageUrl = formData.get('imageUrl')

    try {
      let finalImageUrl = imageUrl || ''

      // If a file was uploaded, use it instead of URL
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        console.log('Uploading image:', imageFile.name, imageFile.size)

        // Upload image to Supabase Storage
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('projects')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          // If about_us bucket doesn't exist, try 'images' bucket
          const { data: altUploadData, error: altUploadError } = await supabase.storage
            .from('images')
            .upload(fileName, imageFile, {
              cacheControl: '3600',
              upsert: false
            })

          if (altUploadError) {
            console.error('Upload error:', altUploadError)
            throw new Error(`Failed to upload image: ${altUploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName)

          finalImageUrl = publicUrl
        } else {
          console.log('Upload successful:', uploadData)

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('about_us')
            .getPublicUrl(fileName)

          finalImageUrl = publicUrl
        }
        console.log('Image URL:', finalImageUrl)
      }

      // Insert about us into database
      const title = {
        ar: titleAr || '',
        en: titleEn || ''
      }

      const description = {
        ar: descAr || '',
        en: descEn || ''
      }

      const { data, error } = await supabase.from('about_us').insert([
        {
          image: finalImageUrl || null,
          title,
          description
        },
      ])

      if (error) throw error

      setMessage({ type: 'success', text: 'About Us entry created successfully!' })
      e.target.reset()
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: err.message || 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-[#572b0a] mb-6">Add About Us Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-[#572b0a] mb-2">
            Image File
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Or use image URL below</p>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-[#572b0a] mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
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
          {loading ? 'Adding...' : 'Add About Us Entry'}
        </Button>
      </form>
    </div>
  )
}

