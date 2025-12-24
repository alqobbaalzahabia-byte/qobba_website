'use client'

import { useState } from 'react'
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import { toast } from 'react-toastify'

const planSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  type: z.enum(['basic', 'premium'], { required_error: 'Plan type is required' }),
  price: z.number().min(0, 'Price must be 0 or greater'),
  discount: z.number().min(0).max(100, 'Discount must be between 0-100'),
  currencyEn: z.string().min(1, 'English currency is required'),
  currencyAr: z.string().min(1, 'Arabic currency is required'),
  display_order: z.number().min(0, 'Display order must be 0 or greater'),
})

export default function AddPlanModal({ isOpen, onClose, onAdd, lng }) {
  const [loading, setLoading] = useState(false)
  const [showContactSales, setShowContactSales] = useState(false)
  const [featuresEn, setFeaturesEn] = useState([''])
  const [featuresAr, setFeaturesAr] = useState([''])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      titleEn: '',
      titleAr: '',
      type: 'basic',
      price: 0,
      discount: 0,
      currencyEn: 'AED',
      currencyAr: 'درهم',
      display_order: 0,
    },
  })

  const watchType = watch('type')

  const addFeature = (lang) => {
    if (lang === 'en') {
      setFeaturesEn([...featuresEn, ''])
    } else {
      setFeaturesAr([...featuresAr, ''])
    }
  }

  const removeFeature = (lang, index) => {
    if (lang === 'en') {
      setFeaturesEn(featuresEn.filter((_, i) => i !== index))
    } else {
      setFeaturesAr(featuresAr.filter((_, i) => i !== index))
    }
  }

  const updateFeature = (lang, index, value) => {
    if (lang === 'en') {
      const newFeatures = [...featuresEn]
      newFeatures[index] = value
      setFeaturesEn(newFeatures)
    } else {
      const newFeatures = [...featuresAr]
      newFeatures[index] = value
      setFeaturesAr(newFeatures)
    }
  }

  const onSubmit = async (data) => {
    // Validate features
    const validFeaturesEn = featuresEn.filter(f => f.trim())
    const validFeaturesAr = featuresAr.filter(f => f.trim())

    if (validFeaturesEn.length === 0) {
      toast.error('Please add at least one feature in English')
      return
    }

    if (validFeaturesAr.length === 0) {
      toast.error('Please add at least one feature in Arabic')
      return
    }

    setLoading(true)
    
    try {
      const formData = {
        title: {
          en: data.titleEn,
          ar: data.titleAr
        },
        type: data.type,
        price: showContactSales ? 0 : Number(data.price),
        discount: showContactSales ? 0 : Number(data.discount),
        currency: {
          en: data.currencyEn,
          ar: data.currencyAr
        },
        features: {
          en: validFeaturesEn,
          ar: validFeaturesAr
        },
        show_contact_sales: showContactSales,
        display_order: Number(data.display_order)
      }

      await onAdd(formData)
      
      toast.success(
        lng === 'ar' 
          ? 'تم إضافة الخطة بنجاح!' 
          : 'Plan added successfully!'
      )
      
      reset()
      setFeaturesEn([''])
      setFeaturesAr([''])
      setShowContactSales(false)
      
      onClose()
    } catch (error) {
      console.error('Error adding plan:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل إضافة الخطة. يرجى المحاولة مرة أخرى.' 
          : 'Failed to add plan. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setFeaturesEn([''])
    setFeaturesAr([''])
    setShowContactSales(false)
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
          <h2 className="text-2xl font-bold text-gray-900">Add New Plan</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Contact Sales Toggle */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-900">Show "Contact Sales"</span>
                <p className="text-xs text-gray-500 mt-1">
                  Enable this for enterprise plans with custom pricing
                </p>
              </div>
              <input
                type="checkbox"
                checked={showContactSales}
                onChange={(e) => setShowContactSales(e.target.checked)}
                className="w-5 h-5 text-[#FAB000] focus:ring-[#FAB000] rounded"
              />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              id="titleEn"
              type="text"
              label="Title (English) *"
              placeholder="Basic Plan"
              error={errors.titleEn?.message}
              {...register('titleEn')}
            />

            <Input
              id="titleAr"
              type="text"
              label="Title (Arabic) *"
              placeholder="الخطة الأساسية"
              error={errors.titleAr?.message}
              dir="rtl"
              {...register('titleAr')}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type *
              </label>
              <select
                {...register('type')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000]"
              >
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <Input
              id="display_order"
              type="number"
              label="Display Order *"
              placeholder="0"
              error={errors.display_order?.message}
              {...register('display_order', { valueAsNumber: true })}
            />
          </div>

          {!showContactSales && (
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                id="price"
                type="number"
                label="Price *"
                placeholder="299"
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />

              <Input
                id="discount"
                type="number"
                label="Discount (%)"
                placeholder="0"
                error={errors.discount?.message}
                {...register('discount', { valueAsNumber: true })}
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              id="currencyEn"
              type="text"
              label="Currency (English) *"
              placeholder="AED"
              error={errors.currencyEn?.message}
              {...register('currencyEn')}
            />

            <Input
              id="currencyAr"
              type="text"
              label="Currency (Arabic) *"
              placeholder="درهم"
              error={errors.currencyAr?.message}
              dir="rtl"
              {...register('currencyAr')}
            />
          </div>

          {/* Features English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (English) *
            </label>
            <div className="space-y-2">
              {featuresEn.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature('en', index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000]"
                  />
                  {featuresEn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature('en', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFeature('en')}
                className="flex items-center gap-2 px-4 py-2 text-[#FAB000] hover:bg-[#FAB000]/10 rounded-lg transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Feature
              </button>
            </div>
          </div>

          {/* Features Arabic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (Arabic) *
            </label>
            <div className="space-y-2">
              {featuresAr.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature('ar', index, e.target.value)}
                    placeholder={`الميزة ${index + 1}`}
                    dir="rtl"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB000]"
                  />
                  {featuresAr.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature('ar', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFeature('ar')}
                className="flex items-center gap-2 px-4 py-2 text-[#FAB000] hover:bg-[#FAB000]/10 rounded-lg transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                إضافة ميزة
              </button>
            </div>
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
              {loading ? 'Adding...' : 'Add Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}