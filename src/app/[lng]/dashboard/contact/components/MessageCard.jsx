'use client'

import { useState, useRef, useEffect } from 'react'
import { HiDotsVertical } from 'react-icons/hi'
import { FiMail, FiMailOpen, FiTrash2, FiUser, FiPhone, FiCalendar, FiMessageSquare } from 'react-icons/fa'
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaUser,
  FaPhone,
  FaCalendar,
  FaComment
} from 'react-icons/fa'

export default function MessageCard({ message, lng, onView, onMarkAsRead, onMarkAsUnread, onDelete }) {
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

  const handleView = () => {
    setIsMenuOpen(false)
    if (onView) {
      onView(message)
    }
  }

  const handleMarkAsRead = () => {
    setIsMenuOpen(false)
    if (onMarkAsRead) {
      onMarkAsRead(message)
    }
  }

  const handleMarkAsUnread = () => {
    setIsMenuOpen(false)
    if (onMarkAsUnread) {
      onMarkAsUnread(message)
    }
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    if (onDelete) {
      onDelete(message)
    }
  }

  const isRead = message.is_read

  return (
    <div 
      className={`bg-white border-2 rounded-lg p-5 hover:shadow-md transition-all duration-300 relative cursor-pointer ${
        isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
      }`}
      onClick={handleView}
    >
      {/* Unread Indicator */}
      {!isRead && (
        <div className="absolute top-5 left-5">
          <span className="w-3 h-3 bg-blue-500 rounded-full block animate-pulse"></span>
        </div>
      )}

      {/* Menu Button */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition-all"
          aria-label="Message options"
        >
          <HiDotsVertical className="text-gray-600 text-lg" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 animate-fade-in">
            <button
              onClick={handleView}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <FaComment className="text-gray-500 w-4 h-4" />
              <span>View Full Message</span>
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            
            {!isRead ? (
              <button
                onClick={handleMarkAsRead}
                className="w-full px-4 py-2.5 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-3 transition-colors"
              >
                <FaEnvelopeOpen className="text-green-600 w-4 h-4" />
                <span>Mark as Read</span>
              </button>
            ) : (
              <button
                onClick={handleMarkAsUnread}
                className="w-full px-4 py-2.5 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
              >
                <FaEnvelope className="text-blue-600 w-4 h-4" />
                <span>Mark as Unread</span>
              </button>
            )}
            
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <FaTrash className="text-red-500 w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${!isRead ? 'ml-6' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`font-bold text-lg mb-1 ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>
              {message.name}
            </h3>
            <p className={`text-sm font-semibold ${isRead ? 'text-gray-600' : 'text-blue-700'}`}>
              {message.subject}
            </p>
          </div>
        </div>

        {/* Message Preview */}
        <p className={`text-sm mb-4 line-clamp-2 ${isRead ? 'text-gray-600' : 'text-gray-700'}`}>
          {message.message}
        </p>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FaEnvelope className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate" dir="ltr">{message.email}</span>
          </div>
          
          {message.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FaPhone className="w-3.5 h-3.5 text-gray-400" />
              <span dir="ltr">{message.phone}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-gray-600 col-span-2">
            <FaCalendar className="w-3.5 h-3.5 text-gray-400" />
            <span>
              {new Date(message.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}