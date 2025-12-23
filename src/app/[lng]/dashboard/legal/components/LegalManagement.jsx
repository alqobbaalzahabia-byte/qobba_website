'use client'

import { useState } from 'react'
import { FiFileText, FiShield } from 'react-icons/fi'
import SectionsList from './SectionsList'

export default function LegalManagement({ terms, privacy, termsError, privacyError, lng }) {
  const [activeTab, setActiveTab] = useState('terms')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'terms'
                ? 'bg-[#FAB000] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiFileText className="w-5 h-5" />
            <span>Terms & Conditions</span>
          </button>
          
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'bg-[#FAB000] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiShield className="w-5 h-5" />
            <span>Privacy Policy</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'terms' ? (
          <SectionsList 
            sections={terms} 
            error={termsError} 
            lng={lng}
            type="terms"
          />
        ) : (
          <SectionsList 
            sections={privacy} 
            error={privacyError} 
            lng={lng}
            type="privacy"
          />
        )}
      </div>
    </div>
  )
}