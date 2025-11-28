'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Button from '../../../components/ui/Button'

export default function TestimonialsForm({ lng }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData(e.target)
    const nameAr = formData.get('nameAr')
    const nameEn = formData.get('nameEn')
    const feedbackAr = formData.get('feedbackAr')
    const feedbackEn = formData.get('feedbackEn')
    const imageFile = formData.get('imageFile')

    try {
      let imageUrl = ''

      // Check if a file was actually selected
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        console.log('Uploading image:', imageFile.name, imageFile.size)

        // Upload image to Supabase Storage
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        // Try testimonials bucket first, fallback to images
        let uploadError = null
        let uploadData = null

        const { data: uploadData1, error: uploadError1 } = await supabase.storage
          .from('public_images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError1) {
          // If testimonials bucket doesn't exist, try 'images' bucket
          const { data: uploadData2, error: uploadError2 } = await supabase.storage
            .from('images')
            .upload(fileName, imageFile, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError2) {
            console.error('Upload error:', uploadError2)
            throw new Error(`Failed to upload image: ${uploadError2.message}`)
          }

          uploadData = uploadData2
          // Get public URL from images bucket
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName)
          imageUrl = publicUrl
        } else {
          uploadData = uploadData1
          // Get public URL from testimonials bucket
          const { data: { publicUrl } } = supabase.storage
            .from('projects')
            .getPublicUrl(fileName)
          imageUrl = publicUrl
        }

        console.log('Upload successful:', uploadData)
        console.log('Image URL:', imageUrl)
      } else {
        throw new Error('Please select an image file to upload')
      }

      // Prepare name as JSON object
      const name = {
        ar: nameAr || 'أحمد محمد',
        en: nameEn || 'John Doe'
      }

      // Prepare feedback as JSON object
      const feedback = {
        ar: feedbackAr || 'شكراً جزيلاً على الخدمة الممتازة. أنا سعيد جداً بالنتائج.',
        en: feedbackEn || 'Thank you very much for the excellent service. I am very happy with the results.'
      }

      // Insert testimonial into database
      const { data, error } = await supabase.from('testimonials').insert([
        {
          image: imageUrl || null,
          name,
          feedback
        },
      ])

      if (error) throw error

      setMessage({ type: 'success', text: 'Testimonial added successfully!' })
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
      <h2 className="text-2xl font-bold text-[#572b0a] mb-6">Add New Testimonial</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-[#572b0a] mb-2">
            Image *
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

        {/* Name - Arabic */}
        <div>
          <label htmlFor="nameAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Name (Arabic)
          </label>
          <input
            type="text"
            id="nameAr"
            name="nameAr"
            defaultValue="أحمد محمد"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="الاسم بالعربية"
          />
        </div>

        {/* Name - English */}
        <div>
          <label htmlFor="nameEn" className="block text-sm font-medium text-[#572b0a] mb-2">
            Name (English)
          </label>
          <input
            type="text"
            id="nameEn"
            name="nameEn"
            defaultValue="John Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="Name in English"
          />
        </div>

        {/* Feedback - Arabic */}
        <div>
          <label htmlFor="feedbackAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Feedback (Arabic)
          </label>
          <textarea
            id="feedbackAr"
            name="feedbackAr"
            rows="4"
            defaultValue="شكراً جزيلاً على الخدمة الممتازة. أنا سعيد جداً بالنتائج."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="التعليق بالعربية"
          />
        </div>

        {/* Feedback - English */}
        <div>
          <label htmlFor="feedbackEn" className="block text-sm font-medium text-[#572b0a] mb-2">
            Feedback (English)
          </label>
          <textarea
            id="feedbackEn"
            name="feedbackEn"
            rows="4"
            defaultValue="Thank you very much for the excellent service. I am very happy with the results."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="Feedback in English"
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
          {loading ? 'Adding...' : 'Add Testimonial'}
        </Button>
      </form>
    </div>
  )
}

