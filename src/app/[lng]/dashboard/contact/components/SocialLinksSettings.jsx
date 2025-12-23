'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiSave } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTiktok } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { toast } from 'react-toastify'

export default function SocialLinksSettings({ socialLinks, error, lng }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    facebook: socialLinks?.facebook || '',
    instagram: socialLinks?.instagram || '',
    twitter: socialLinks?.twitter || '',
    // linkedin: socialLinks?.linkedin || '',
    // youtube: socialLinks?.youtube || '',
    // tiktok: socialLinks?.tiktok || '',
  })

  const socialPlatforms = [
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <FaFacebookF className="w-5 h-5" />,
      color: '#1877F2',
      placeholder: 'https://facebook.com/yourpage'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: <FaInstagram className="w-5 h-5" />,
      color: '#E4405F',
      placeholder: 'https://instagram.com/yourprofile'
    },
    {
      key: 'twitter',
      label: 'X (Twitter)',
      icon: <FaXTwitter className="w-5 h-5" />,
      color: '#000000',
      placeholder: 'https://x.com/yourprofile'
    },
    // {
    //   key: 'linkedin',
    //   label: 'LinkedIn',
    //   icon: <FaLinkedinIn className="w-5 h-5" />,
    //   color: '#0A66C2',
    //   placeholder: 'https://linkedin.com/company/yourcompany'
    // },
    // {
    //   key: 'youtube',
    //   label: 'YouTube',
    //   icon: <FaYoutube className="w-5 h-5" />,
    //   color: '#FF0000',
    //   placeholder: 'https://youtube.com/@yourchannel'
    // },
    // {
    //   key: 'tiktok',
    //   label: 'TikTok',
    //   icon: <FaTiktok className="w-5 h-5" />,
    //   color: '#000000',
    //   placeholder: 'https://tiktok.com/@yourprofile'
    // }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateUrl = (url, platform) => {
    if (!url) return true
    
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      
      const platformDomains = {
        facebook: ['facebook.com', 'fb.com'],
        instagram: ['instagram.com'],
        twitter: ['twitter.com', 'x.com'],
        // linkedin: ['linkedin.com'],
        // youtube: ['youtube.com', 'youtu.be'],
        // tiktok: ['tiktok.com']
      }
      
      return platformDomains[platform]?.some(domain => hostname.includes(domain))
    } catch {
      return false
    }
  }

  const handleSave = async () => {
    for (const [key, value] of Object.entries(formData)) {
      if (value && !validateUrl(value, key)) {
        toast.error(
          lng === 'ar' 
            ? `رابط ${socialPlatforms.find(p => p.key === key)?.label} غير صحيح` 
            : `Invalid ${socialPlatforms.find(p => p.key === key)?.label} URL`
        )
        return
      }
    }

    setLoading(true)

    try {
      const { data: existingData } = await supabase
        .from('social_links')
        .select('id')
        .limit(1)
        .single()

      if (existingData) {
        const { error } = await supabase
          .from('social_links')
          .update(formData)
          .eq('id', existingData.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('social_links')
          .insert([formData])

        if (error) throw error
      }

      toast.success(
        lng === 'ar' 
          ? 'تم تحديث روابط التواصل الاجتماعي بنجاح!' 
          : 'Social media links updated successfully!'
      )
      
      router.refresh()
    } catch (error) {
      console.error('Error saving social links:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل تحديث روابط التواصل الاجتماعي. يرجى المحاولة مرة أخرى.' 
          : 'Failed to update social media links. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading social media links</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Social Media Links</h2>
        <p className="text-gray-600 text-sm">
          Manage your company's social media profiles displayed in the footer
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {socialPlatforms.map((platform) => (
          <div key={platform.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span 
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg mr-2"
                style={{ backgroundColor: `${platform.color}15` }}
              >
                <span style={{ color: platform.color }}>
                  {platform.icon}
                </span>
              </span>
              {platform.label}
            </label>
            <input
              type="url"
              name={platform.key}
              value={formData[platform.key]}
              onChange={handleChange}
              disabled={loading}
              placeholder={platform.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000] disabled:opacity-50"
              dir="ltr"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {socialPlatforms.map((platform) => {
            const url = formData[platform.key]
            if (!url) return null
            
            return (
              <a
                key={platform.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border bg-[#F0A647] text-white border-white/30 p-3 transition hover:border-gray-300 hover:text-[#F0A647] hover:bg-gray-200 shadow-sm"
                title={platform.label}
              >
                {platform.icon}
              </a>
            )
          })}
          {Object.values(formData).every(v => !v) && (
            <p className="text-sm text-gray-500 italic">
              No social media links added yet
            </p>
          )}
        </div>
      </div>

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