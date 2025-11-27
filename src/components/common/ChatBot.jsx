'use client'

import React, { useState, useEffect } from 'react'
import { FaComments, FaTimes } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useTranslation } from '@/app/i18n/client'

const ChatBot = ({ lng = 'ar' }) => {
  const { t } = useTranslation(lng)
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isVerified, setIsVerified] = useState(false)
  // send otp to the user on email
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { error: insertError } = await supabase
        .from('guests')
        .insert([
          {
            name: name,
            email: email,
            is_verified: false
          }
        ])

      if (insertError) {
        setMessage({ 
          type: 'error', 
          text: t('chatbot.errorTryAnotherEmail')
        })
      } else {
        const { data, error } = await supabase.auth.signInWithOtp({
          email: email,
        })

          setMessage({ 
            type: 'success', 
            text: t('chatbot.otpSent')
          })
          setName('')
          setEmail('')
        
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || t('chatbot.errorOccurred')
      })
    } finally {
      setLoading(false)
    }
  }
  // if the user is verified and update the user status to verified if exists in the database
  useEffect(() => {
    async function getAuthData() {
      const { data: sessionData, error } = await supabase.auth.getSession()
       const userEmail = sessionData.session?.user?.user_metadata?.email;
      const isEmailVerified = sessionData.session?.user?.user_metadata?.email_verified;
      if (isEmailVerified) {
        const { data: updatedUser, error: updateError } = await supabase
        .from('guests')
        .update({ is_verified: true })
        .eq('email', userEmail)
        .select();
        setIsVerified(true)
      if (updateError) {
        console.error('Update error:', updateError);
      } else {
        console.log('User updated:', updatedUser);
        setIsVerified(true)
      }
      }
    }
    getAuthData()
  }, [])

  return (
    <div className='chatbot-section'>
      {/* Chat Button icon */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`cursor-pointer fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-[#f0a647] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-white`}
        aria-label={t('chatbot.openChat')}
      >
        <FaComments className="w-6 h-6" />
      </button>

      {/* Modal for send otp to the user on email */}
      {isOpen && !isVerified && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={t('chatbot.closeModal')}
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className={`${lng === 'ar' ? 'text-right' : 'text-left'}`}>
              <h2 className="text-xl font-bold text-[#572b0a] mb-6">
                {t('chatbot.verifyEmailTitle')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="chatbot-name"
                    className="block text-sm font-medium text-[#572b0a] mb-2"
                  >
                    {t('chatbot.name')}
                  </label>
                  <input
                    type="text"
                    id="chatbot-name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent outline-none transition-all"
                    placeholder={t('chatbot.namePlaceholder')}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="chatbot-email"
                    className="block text-sm font-medium text-[#572b0a] mb-2"
                  >
                    {t('chatbot.email')}
                  </label>
                  <input
                    type="email"
                    id="chatbot-email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent outline-none transition-all"
                    placeholder={t('chatbot.emailPlaceholder')}
                  />
                </div>

                {/* Message */}
                {message.text && (
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full bg-[#f0a647] hover:opacity-90 text-white py-3 px-6 rounded-lg font-medium mt-4"
                >
                  {loading ? t('chatbot.sending') : t('chatbot.submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* modal for chatbot if the user is verified */}
      {isOpen && isVerified && (
        <div
          className="fixed  right-5 bottom-20  z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[400px] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className=" cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label={t('chatbot.closeChat')}
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Messages */}
            <div
              id="messages"
              className="flex flex-col space-y-4 p-4 overflow-y-auto scrolling-touch flex-1"
            >
              {/* Bot message */}
              <div>
                <div className="flex items-end">
                  <div className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 order-2 items-start">
                    <div>
                      <span className="px-4 py-3 rounded-xl inline-block rounded-bl-none bg-gray-100 text-gray-600">
                        {t('chatbot.botGreeting')}
                      </span>
                    </div>
                  </div>
                  <img
                    src="https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                    alt="bot"
                    className="w-6 h-6 rounded-full order-1"
                  />
                </div>
              </div>

              {/* User message */}
              <div>
                <div className="flex items-end justify-end">
                  <div className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 order-1 items-end">
                    <div>
                      <span className="px-4 py-3 rounded-xl inline-block rounded-br-none bg-blue-500 text-white">
                        {t('chatbot.userMessage')}
                      </span>
                    </div>
                  </div>
                  <img
                    src="https://i.pravatar.cc/100?img=7"
                    alt="user"
                    className="w-6 h-6 rounded-full order-2"
                  />
                </div>
              </div>

              {/* Typing animation (static) */}
              <div>
                <div className="flex items-end">
                  <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
                    <img
                      src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                      alt="typing..."
                      className="w-16 ml-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t-2 border-gray-200 px-4 pt-4 pb-4">
              <div className="relative flex">
                <input
                  type="text"
                  placeholder={t('chatbot.inputPlaceholder')}
                  className="text-md w-full focus:outline-none text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2"
                />
                <div className="absolute right-2 inset-y-0 flex items-center">
                  <button className="inline-flex items-center justify-center rounded-full h-8 w-8 text-white bg-blue-500 hover:bg-blue-600">
                    ➤
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

</div>

  )}

export default ChatBot

