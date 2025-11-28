'use client'

import { useState } from 'react'
import { insertPlan } from '@/app/[lng]/contact/actions'
import Button from '../../../components/ui/Button'

export default function PlansForm({ lng }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData(e.target)
    
    
    try {
      const result = await insertPlan(formData)
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Plan added successfully!' })
        e.target.reset()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add plan' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-[#572b0a] mb-6">Add New Plan</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title - Arabic */}
        <div>
          <label htmlFor="titleAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Title (Arabic)
          </label>
          <input
            type="text"
            id="titleAr"
            name="titleAr"
            defaultValue="الخطة الأساسية"
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
            defaultValue="Basic Plan"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="Title in English"
          />
        </div>

        {/* Features - Arabic */}
        <div>
          <label htmlFor="featuresAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Features (Arabic)
          </label>
          <textarea
            id="featuresAr"
            name="featuresAr"
            rows="6"
            defaultValue="" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder=" برجاء ادخل كل ميزة علي سطر جديد "
          />
        </div>

        {/* Features - English */}
        <div>
          <label htmlFor="featuresEn" className="block text-sm font-medium text-[#572b0a] mb-2">
            Features (English)
          </label>
          <textarea
            id="featuresEn"
            name="featuresEn"
            rows="6"
            defaultValue=""
            dir="ltr"
            className="  w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="please enter each feature on a new line"
               />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-[#572b0a] mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            defaultValue="99.99"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        {/* Currency - Arabic */}
        <div>
          <label htmlFor="currencyAr" className="block text-sm font-medium text-[#572b0a] mb-2">
            Currency (Arabic)
          </label>
          <input
            type="text"
            id="currencyAr"
            name="currencyAr"
            defaultValue="درهم"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="العملة بالعربية"
          />
        </div>

        {/* Currency - English */}
        <div>
          <label htmlFor="currencyEn" className="block text-sm font-medium text-[#572b0a] mb-2">
            Currency (English)
          </label>
          <input
            type="text"
            id="currencyEn"
            name="currencyEn"
            defaultValue="AED"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="Currency in English"
          />
        </div>

        {/* Discount */}
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-[#572b0a] mb-2">
            Discount Percentage 
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            step="0.01"
            min="0"
            max="100"
            defaultValue="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
            placeholder="0"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[#572b0a] mb-2">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue="permuim"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
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
          {loading ? 'Adding...' : 'Add Plan'}
        </Button>
      </form>
    </div>
  )
}

