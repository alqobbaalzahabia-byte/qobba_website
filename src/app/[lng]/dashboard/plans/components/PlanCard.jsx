'use client'

import { useState, useRef, useEffect } from 'react'
import { HiDotsVertical } from 'react-icons/hi'
import { FiEdit, FiTrash2, FiDollarSign, FiTag, FiList, FiPhone } from 'react-icons/fi'

export default function PlanCard({ plan, lng, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleEdit = () => {
    setIsMenuOpen(false)
    if (onEdit) {
      onEdit(plan)
    }
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    if (onDelete) {
      onDelete(plan)
    }
  }

  const isPremium = plan.type === 'premium'
  const isContactSales = plan.show_contact_sales
  const features = plan.features?.[lng] || plan.features?.en || []
  const currency = plan.currency?.[lng] || plan.currency?.en || 'AED'
  const discountedPrice = plan.discount > 0 ? plan.price * (1 - plan.discount / 100) : plan.price

  return (
    <div className={`bg-white border-2 rounded-lg p-6 hover:shadow-md transition-all duration-300 relative ${
      isPremium ? 'border-[#FAB000]' : 'border-gray-200'
    }`}>
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#FAB000] to-[#E19F00] text-white text-xs font-bold rounded-full shadow-md">
            ⭐ Premium
          </span>
        </div>
      )}

      {/* Contact Sales Badge */}
      {isContactSales && (
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            <FiPhone className="w-3 h-3" />
            Contact Sales
          </span>
        </div>
      )}

      {/* Menu Button */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-all"
          aria-label="Plan options"
        >
          <HiDotsVertical className="text-gray-600 text-lg" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 animate-fade-in">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <FiEdit className="text-gray-500 w-4 h-4" />
              <span>Edit Plan</span>
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <FiTrash2 className="text-red-500 w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${isPremium ? 'pt-4' : ''} ${isContactSales ? 'mt-8' : ''}`}>
        {/* Title */}
        <h3 className="font-bold text-2xl text-gray-900 mb-4 text-center">
          {plan.title?.[lng] || plan.title?.en || 'Untitled Plan'}
        </h3>

        {/* Price Section */}
        {!isContactSales ? (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold text-[#FAB000]">
                {discountedPrice.toFixed(0)}
              </span>
              <span className="text-xl font-bold text-[#FAB000]">
                {currency}
              </span>
            </div>
            
            {plan.discount > 0 && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg text-gray-400 line-through">
                  {plan.price.toFixed(0)} {currency}
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                  -{plan.discount}%
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 text-center">
            <div className="text-2xl font-bold text-[#FAB000] mb-1">
              Custom Pricing
            </div>
            <p className="text-sm text-gray-600">Contact us for details</p>
          </div>
        )}

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiList className="w-4 h-4 text-gray-400" />
            <span className="font-semibold">{features.length} Features</span>
          </div>
          
          <ul className="space-y-2 pl-6">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 list-disc">
                {feature}
              </li>
            ))}
            {features.length > 3 && (
              <li className="text-sm text-gray-400 italic">
                +{features.length - 3} more features
              </li>
            )}
          </ul>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FiTag className="w-3.5 h-3.5" />
            <span>Order: {plan.display_order || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiDollarSign className="w-3.5 h-3.5" />
            <span className="capitalize">{plan.type || 'basic'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}