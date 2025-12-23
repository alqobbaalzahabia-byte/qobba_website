'use client'

import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import RichTextEditor from './RichTextEditor'
import { toast } from 'react-toastify'

const sectionSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  contentEn: z.string().min(10, 'English content must be at least 10 characters'),
  contentAr: z.string().min(10, 'Arabic content must be at least 10 characters'),
})

export default function AddSectionModal({ isOpen, onClose, onAdd, lng, type }) {
  const [loading, setLoading] = useState(false)
  const [contentEn, setContentEn] = useState('')
  const [contentAr, setContentAr] = useState('')

  const displayName = type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      titleEn: '',
      titleAr: '',
      contentEn: '',
      contentAr: '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      const formData = {
        title: {
          en: data.titleEn,
          ar: data.titleAr || ''
        },
        content: {
          en: contentEn || data.contentEn,
          ar: contentAr || data.contentAr
        }
      }

      await onAdd(formData)
      
      toast.success(
        lng === 'ar' 
          ? 'تم إضافة القسم بنجاح!' 
          : 'Section added successfully!'
      )
      
      reset()
      setContentEn('')
      setContentAr('')
      
      onClose()
    } catch (error) {
      console.error('Error adding section:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل إضافة القسم. يرجى المحاولة مرة أخرى.' 
          : 'Failed to add section. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setContentEn('')
    setContentAr('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Section</h2>
            <p className="text-sm text-gray-500 mt-1">{displayName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <Input
            id="titleEn"
            type="text"
            label="Title (English) *"
            placeholder="Section title in English"
            error={errors.titleEn?.message}
            {...register('titleEn')}
          />

          <Input
            id="titleAr"
            type="text"
            label="Title (Arabic) *"
            placeholder="عنوان القسم بالعربية"
            error={errors.titleAr?.message}
            dir="rtl"
            {...register('titleAr')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (English) *
            </label>
            <RichTextEditor
              value={contentEn}
              onChange={(value) => {
                setContentEn(value)
                setValue('contentEn', value)
              }}
              placeholder="Enter content in English. Use bullet points for lists."
            />
            {errors.contentEn && (
              <p className="mt-1 text-sm text-red-600">{errors.contentEn.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (Arabic) *
            </label>
            <RichTextEditor
              value={contentAr}
              onChange={(value) => {
                setContentAr(value)
                setValue('contentAr', value)
              }}
              placeholder="أدخل المحتوى بالعربية. استخدم النقاط للقوائم."
              dir="rtl"
            />
            {errors.contentAr && (
              <p className="mt-1 text-sm text-red-600">{errors.contentAr.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={handleClose}
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
              {loading ? 'Adding...' : 'Add Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}