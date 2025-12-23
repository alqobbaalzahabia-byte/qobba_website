'use client'

import { useState, useRef, useEffect } from 'react'
import { HiDotsVertical } from 'react-icons/hi'
import { FiEdit, FiTrash2, FiList } from 'react-icons/fi'

export default function SectionCard({ section, lng, onEdit, onDelete }) {
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
      onEdit(section)
    }
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    if (onDelete) {
      onDelete(section)
    }
  }

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const contentPreview = section.content?.[lng] || section.content?.en || ''
  const plainTextPreview = stripHtml(contentPreview)

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 relative">
      <div className="absolute top-4 right-4 z-10" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-all"
          aria-label="Section options"
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
              <span>Edit Section</span>
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

      <div className="pr-12">
        <h3 className="font-bold text-xl text-gray-900 mb-3">
          {section.title?.[lng] || section.title?.en || 'Untitled Section'}
        </h3>
        
        <div className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
          {plainTextPreview}
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FiList className="w-3.5 h-3.5" />
            <span>{plainTextPreview.length} characters</span>
          </div>
        </div>
      </div>
    </div>
  )
}