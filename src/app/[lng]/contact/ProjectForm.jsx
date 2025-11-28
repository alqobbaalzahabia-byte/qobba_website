'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Button from '../../../components/ui/Button'

export default function ProjectForm({ lng }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData(e.target)
    const nameAr = formData.get('titleAr')
    const nameEn = formData.get('titleEn')
    const descAr = formData.get('descriptionAr')
    const descEn = formData.get('descriptionEn')
    const imageFile = formData.get('imageFile')

    try {
      let imageUrl = ''

      // Check if a file was actually selected
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
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload image: ${uploadError.message}`)
        }

        console.log('Upload successful:', uploadData)

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
        console.log('Image URL:', imageUrl)
      } else {
        throw new Error('Please select an image file to upload')
      }

      // Insert project into database
      const title = {
        ar: nameAr || 'التسويق الرقمي',
        en: nameEn || 'Digital Marketing'
      };

      const description = {
        ar: descAr || 'التسويق الرقمي هو استخدام الوسائل الرقمية للوصول إلى العملاء وتحسين ظهور العلامة التجارية.',
        en: descEn || 'Digital marketing is the use of digital channels to reach customers and enhance brand visibility.'
      };


      const { data, error } = await supabase.from('projects').insert([
        {
          image: imageUrl || null,
          title,
          description
        },
      ])

      if (error) throw error

      setMessage({ type: 'success', text: 'Project created successfully!' })
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
      <h2 className="text-2xl font-bold text-[#572b0a] mb-6">Create New Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-[#572b0a] mb-2">
            Project Image *
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
          />
        </div>

        {/* Title - Arabic */}
        <div>
          <label htmlFor="titleAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Project Title (Arabic)
          </label>
          <input
            type="text"
            id="titleAr"
            name="titleAr"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="عنوان المشروع بالعربية"
          />
        </div>

        {/* Title - English */}
        <div>
          <label htmlFor="titleEn" className="block text-sm font-medium text-[#572b0a] mb-2">
            Project Title (English)
          </label>
          <input
            type="text"
            id="titleEn"
            name="titleEn"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="Project title in English"
          />
        </div>

        {/* Description - Arabic */}
        <div>
          <label htmlFor="descriptionAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Project Description (Arabic)
          </label>
          <textarea
            id="descriptionAr"
            name="descriptionAr"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="وصف المشروع بالعربية"
          />
        </div>

        {/* Description - English */}
        <div>
          <label htmlFor="descriptionEn" className="block text-sm font-medium text-[#572b0a] mb-2">
            Project Description (English)
          </label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="Project description in English"
          />
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`p-3 rounded-lg ${message.type === 'success'
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
          {loading ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </div>
  )
}
