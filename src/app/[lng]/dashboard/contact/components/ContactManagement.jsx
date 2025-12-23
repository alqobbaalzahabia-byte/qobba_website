'use client'

import { useState } from 'react'
import { FiSettings, FiMail } from 'react-icons/fi'
import { FaShareAlt } from 'react-icons/fa'
import ContactInfoSettings from './ContactInfoSettings'
import MessagesList from './MessagesList'
import SocialLinksSettings from './SocialLinksSettings'
export default function ContactManagement({ contactInfo, messages,socialLinks, contactError, messagesError,socialLinksError, lng }) {
  const [activeTab, setActiveTab] = useState('messages') // 'messages' or 'settings'

  const unreadCount = messages?.filter(msg => !msg.is_read).length || 0

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors relative ${
              activeTab === 'messages'
                ? 'bg-[#FAB000] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiMail className="w-5 h-5" />
            <span>Customer Messages</span>
            {unreadCount > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full ${
                activeTab === 'messages' 
                  ? 'bg-white text-[#FAB000]' 
                  : 'bg-blue-500 text-white'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#FAB000] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiSettings className="w-5 h-5" />
            <span>Contact Information</span>
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'social'
                ? 'bg-[#FAB000] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaShareAlt className="w-5 h-5" />
            <span>Social Media</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'messages' && (
          <MessagesList messages={messages} error={messagesError} lng={lng} />
        )}
        {activeTab === 'settings' && (
          <ContactInfoSettings contactInfo={contactInfo} error={contactError} lng={lng} />
        )}
        {activeTab === 'social' && (
          <SocialLinksSettings socialLinks={socialLinks} error={socialLinksError} lng={lng} />
        )}
      </div>
    </div>
  )
}