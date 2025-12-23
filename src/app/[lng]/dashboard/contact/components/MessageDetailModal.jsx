'use client'

import { FiX, FiMail, FiPhone, FiUser, FiMessageSquare, FiCalendar } from 'react-icons/fi'

export default function MessageDetailModal({ message, isOpen, onClose, lng }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Received on {new Date(message.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info Section */}
          <div className="bg-gray-50 rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg mb-3">Customer Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <FiUser className="w-5 h-5 text-[#FAB000]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Name</p>
                  <p className="text-sm text-gray-900 font-semibold">{message.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <FiMail className="w-5 h-5 text-[#FAB000]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                  <a 
                    href={`mailto:${message.email}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium break-all"
                    dir="ltr"
                  >
                    {message.email}
                  </a>
                </div>
              </div>

              {message.phone && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FiPhone className="w-5 h-5 text-[#FAB000]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                    <a 
                      href={`tel:${message.phone}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      dir="ltr"
                    >
                      {message.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <FiCalendar className="w-5 h-5 text-[#FAB000]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Submitted</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {new Date(message.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 font-medium">{message.subject}</p>
            </div>
          </div>

          {/* Message Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[150px]">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject}`}
              className="flex items-center gap-2 px-6 py-3 bg-[#FAB000] hover:bg-[#E19F00] text-white font-semibold rounded-lg transition-colors"
            >
              <FiMail className="w-4 h-4" />
              Reply via Email
            </a>
            
            {message.phone && (
              <a
                href={`tel:${message.phone}`}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                Call Customer
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}