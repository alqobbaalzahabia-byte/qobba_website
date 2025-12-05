'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { HiDotsVertical } from 'react-icons/hi'
import { FiEdit, FiTrash2 } from 'react-icons/fi'

export default function ServiceCard({ service, lng, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
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
      onEdit(service)
    }
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    if (onDelete) {
      onDelete(service)
    }
  }

  return (
    <div className=" border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Three dots menu button */}
      <div className=" absolute top-2 right-2 z-10" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="cursor-pointer p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110"
          aria-label="Service options"
        >
          <HiDotsVertical className="text-gray-600 text-lg" />
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <FiEdit className="text-gray-500" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <FiTrash2 className="text-red-500" />
              Delete
            </button>
          </div>
        )}
      </div>

      {service.image && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title?.[lng] || service.title || 'Service'}
            width={400}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 text-lg">
          {service.title?.[lng] || service.title || 'Untitled Service'}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {service.description?.[lng] || service.description || 'No description'}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Created: {new Date(service.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

