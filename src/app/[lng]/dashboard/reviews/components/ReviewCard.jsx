'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { HiDotsVertical } from 'react-icons/hi'
import { FiEdit, FiTrash2, FiImage, FiCheck, FiX, FiClock } from 'react-icons/fi'

export default function ReviewCard({ review, lng, onEdit, onDelete, onApprove, onReject }) {
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
      onEdit(review)
    }
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    if (onDelete) {
      onDelete(review)
    }
  }

  const handleApprove = () => {
    setIsMenuOpen(false)
    if (onApprove) {
      onApprove(review)
    }
  }

  const handleReject = () => {
    setIsMenuOpen(false)
    if (onReject) {
      onReject(review)
    }
  }

  const isApproved = review.is_approved

  return (
    <div className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative group ${
      isApproved ? 'border-green-200' : 'border-yellow-200'
    }`}>
      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        {isApproved ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            <FiCheck className="w-3 h-3" />
            Approved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full animate-pulse">
            <FiClock className="w-3 h-3" />
            Pending
          </span>
        )}
      </div>

      {/* Menu Button */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full bg-white/95 hover:bg-white shadow-md transition-all hover:scale-110"
          aria-label="Review options"
        >
          <HiDotsVertical className="text-gray-600 text-lg" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 animate-fade-in">
            {!isApproved && (
              <>
                <button
                  onClick={handleApprove}
                  className="w-full px-4 py-2.5 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-3 transition-colors"
                >
                  <FiCheck className="text-green-600 w-4 h-4" />
                  <span>Approve Review</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
              </>
            )}
            
            {isApproved && (
              <>
                <button
                  onClick={handleReject}
                  className="w-full px-4 py-2.5 text-left text-sm text-orange-700 hover:bg-orange-50 flex items-center gap-3 transition-colors"
                >
                  <FiX className="text-orange-600 w-4 h-4" />
                  <span>Reject Review</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
              </>
            )}
            
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <FiEdit className="text-gray-500 w-4 h-4" />
              <span>Edit Review</span>
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

      {/* Customer Image */}
      <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
        {review.image ? (
          <div className="flex items-center justify-center h-full bg-linear-to-br from-gray-50 to-gray-100">
            <Image
              src={review.image}
              alt={review.name?.[lng] || review.name || 'Customer'}
              width={80}
              height={80}
              className="rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <FiImage className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Customer Name */}
        <h3 className="font-bold text-gray-900 mb-2 text-lg text-center">
          {review.name?.[lng] || review.name || 'Anonymous'}
        </h3>
        
        {/* Feedback */}
        <p className="text-sm text-gray-600 line-clamp-4 min-h-20 mb-4 text-center italic">
          "{review.feedback?.[lng] || review.feedback || 'No feedback provided'}"
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Submitted</span>
            <span className="text-xs text-gray-600 font-semibold">
              {new Date(review.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Quick Action Buttons */}
          {!isApproved && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleApprove}
                className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                title="Approve"
              >
                <FiCheck className="w-4 h-4" />
              </button>
              <button
                onClick={handleReject}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                title="Reject"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}