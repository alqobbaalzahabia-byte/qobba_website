'use client'

import { use, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { FiEdit2 } from 'react-icons/fi'
import Image from 'next/image'
import EditAboutModal from './components/EditAboutModal'

export default function AboutUsPage({ params }) {
  const { lng } = use(params)
  const router = useRouter()
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setAboutData(data)
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSave = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        updated_at: new Date().toISOString()
      }

      let result
      if (aboutData) {
        result = await supabase
          .from('about_us')
          .update(payload)
          .eq('id', aboutData.id)
          .select()
          .single()
      } else {
        payload.created_at = new Date().toISOString()
        result = await supabase
          .from('about_us')
          .insert([payload])
          .select()
          .single()
      }

      if (result.error) {
        throw result.error
      }

      setAboutData(result.data)
      router.refresh()
    } catch (error) {
      console.error('Error saving about data:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAB000]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {lng === 'ar' ? 'إدارة من نحن' : 'Manage About Us'}
          </h1>
          <p className="text-gray-600 mt-2">
            {lng === 'ar' 
              ? 'عرض وتحديث معلومات قسم "من نحن"' 
              : 'View and update About Us section'
            }
          </p>
        </div>
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-6 py-3 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors shadow-md hover:shadow-lg"
        >
          <FiEdit2 className="w-5 h-5" />
          {lng === 'ar' ? 'تعديل' : 'Edit'}
        </button>
      </div>

      {/* Content Display */}
      {aboutData ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image */}
          {aboutData.image && (
            <div className="relative w-full h-64 bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={aboutData.image}
                alt="About us"
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title Section */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {lng === 'ar' ? 'العنوان' : 'Title'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">English</p>
                  <p className="text-xl font-bold text-gray-900">
                    {aboutData.title?.en || 'No English title'}
                  </p>
                </div>
                <div className={lng === 'ar' ? 'text-right' : ''}>
                  <p className="text-xs text-gray-500 mb-1">عربي</p>
                  <p className="text-xl font-bold text-gray-900" dir="rtl">
                    {aboutData.title?.ar || 'لا يوجد عنوان عربي'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {lng === 'ar' ? 'الوصف' : 'Description'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2">English</p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aboutData.description?.en || 'No English description'}
                  </p>
                </div>
                <div className={lng === 'ar' ? 'text-right' : ''}>
                  <p className="text-xs text-gray-500 mb-2">عربي</p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" dir="rtl">
                    {aboutData.description?.ar || 'لا يوجد وصف عربي'}
                  </p>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            {aboutData.updated_at && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  {lng === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
                  {new Date(aboutData.updated_at).toLocaleDateString(lng === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <FiEdit2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {lng === 'ar' ? 'لا توجد بيانات' : 'No Data Found'}
            </h3>
            <p className="text-gray-500 max-w-md">
              {lng === 'ar' 
                ? 'لم يتم إنشاء قسم "من نحن" بعد. انقر على زر التعديل لإضافة المحتوى.' 
                : 'About Us section has not been created yet. Click the Edit button to add content.'
              }
            </p>
            <button
              onClick={handleEdit}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors"
            >
              <FiEdit2 className="w-5 h-5" />
              {lng === 'ar' ? 'إضافة محتوى' : 'Add Content'}
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditAboutModal
        aboutData={aboutData}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        lng={lng}
      />
    </div>
  )
}