'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiSave, FiPhone, FiMail, FiMapPin, FiMap } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function ContactInfoSettings({ contactInfo, error, lng }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: contactInfo?.find(item => item.key === 'phone')?.value || '',
    whatsapp: contactInfo?.find(item => item.key === 'whatsapp')?.value || '',
    email: contactInfo?.find(item => item.key === 'email')?.value || '',
    location: contactInfo?.find(item => item.key === 'location')?.value || '',
    location_details: contactInfo?.find(item => item.key === 'location_details')?.value || '',
    map_url: contactInfo?.find(item => item.key === 'map_url')?.value || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      const updates = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
        label: {
          en: getEnglishLabel(key),
          ar: getArabicLabel(key)
        }
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('contact_info')
          .upsert(
            {
              key: update.key,
              value: update.value,
              label: update.label
            },
            { onConflict: 'key' }
          )

        if (error) throw error
      }

      toast.success(
        lng === 'ar' 
          ? 'تم تحديث معلومات الاتصال بنجاح!' 
          : 'Contact information updated successfully!'
      )
      
      router.refresh()
    } catch (error) {
      console.error('Error saving contact info:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل تحديث معلومات الاتصال. يرجى المحاولة مرة أخرى.' 
          : 'Failed to update contact information. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const getEnglishLabel = (key) => {
    const labels = {
      phone: 'Phone Number',
      whatsapp: 'WhatsApp Number',
      email: 'Email Address',
      location: 'Location',
      location_details: 'Location Details',
      map_url: 'Map URL'
    }
    return labels[key] || key
  }

  const getArabicLabel = (key) => {
    const labels = {
      phone: 'رقم الهاتف',
      whatsapp: 'رقم الواتساب',
      email: 'البريد الإلكتروني',
      location: 'الموقع',
      location_details: 'تفاصيل الموقع',
      map_url: 'رابط الخريطة'
    }
    return labels[key] || key
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading contact information</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600 text-sm">
          Manage your company's contact details displayed on the website
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiPhone className="inline w-4 h-4 mr-2 text-[#FAB000]" />
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            placeholder="+971 XX XXX XXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000] disabled:opacity-50"
            dir="ltr"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaWhatsapp className="inline w-4 h-4 mr-2 text-green-500" />
            WhatsApp Number
          </label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            disabled={loading}
            placeholder="+971 XX XXX XXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000] disabled:opacity-50"
            dir="ltr"
          />
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMail className="inline w-4 h-4 mr-2 text-[#FAB000]" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="info@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000] disabled:opacity-50"
            dir="ltr"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMapPin className="inline w-4 h-4 mr-2 text-[#FAB000]" />
            Location (City, Country)
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
            placeholder="Dubai, UAE"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000] disabled:opacity-50"
          />
        </div>

        {/* Location Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMapPin className="inline w-4 h-4 mr-2 text-[#FAB000]" />
            Location Details (Building, Office)
          </label>
          <input
            type="text"
            name="location_details"
            value={formData.location_details}
            onChange={handleChange}
            disabled={loading}
            placeholder="Horizon Building, Office 42"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000] disabled:opacity-50"
          />
        </div>

        {/* Map URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMap className="inline w-4 h-4 mr-2 text-[#FAB000]" />
            Google Maps Embed URL
          </label>
          <input
            type="url"
            name="map_url"
            value={formData.map_url}
            onChange={handleChange}
            disabled={loading}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000] disabled:opacity-50"
            dir="ltr"
          />
          <p className="mt-2 text-xs text-gray-500">
            Get the embed URL from Google Maps: Share → Embed a map → Copy HTML
          </p>
        </div>
      </div>

      {/* Map Preview */}
      {formData.map_url && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map Preview
          </label>
          <div className="relative bg-white rounded-lg border border-gray-300 overflow-hidden h-[300px]">
            <iframe
              src={formData.map_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Preview"
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#FAB000] hover:bg-[#E19F00] text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}