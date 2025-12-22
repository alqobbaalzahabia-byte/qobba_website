'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { HiDotsVertical } from 'react-icons/hi'
import { FiEdit, FiTrash2, FiImage } from 'react-icons/fi'

export default function TeamCard({ member, lng, onEdit, onDelete }) {
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
      onEdit(member)
    }
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    if (onDelete) {
      onDelete(member)
    }
  }

  return (
    <div className="w-full max-w-[280px] bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 relative group">
      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full bg-white/95 hover:bg-white shadow-md transition-all hover:scale-110"
          aria-label="Team member options"
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
              <span>Edit Member</span>
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

      <div className="relative w-full h-[280px] overflow-hidden bg-gray-100">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name?.[lng] || member.name || 'Team Member'}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <FiImage className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4 text-center bg-white">
        <h3 className="text-xl font-bold text-[#572b0a] mb-1 transition-colors duration-300">
          {member.name?.[lng] || member.name || 'No Name'}
        </h3>
        <p className="text-[14px] text-[#999999] transition-colors duration-300">
          {member.position?.[lng] || member.position || 'No Position'}
        </p>
      </div>
    </div>
  )
}