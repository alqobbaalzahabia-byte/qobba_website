'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FaComments, FaTimes } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'
import { useTranslation } from '@/app/i18n/client'
import { useParams } from 'next/navigation'

const findBestResponse = (userInput, faqDatabase, t) => {
  const input = userInput.toLowerCase().trim()
  
  const agentKeywords = ['agent', 'human', 'person', 'representative', 'موظف', 'ممثل', 'شخص']
  if (agentKeywords.some(keyword => input.includes(keyword))) {
    return {
      response: t('chatbot.responses.agent_request'),
      category: 'agent_request'
    }
  }

  let bestMatch = null
  let highestScore = 0

  for (const faq of faqDatabase) {
    if (!faq.is_active) continue

    let score = 0
    let matchedKeywords = []

    if (faq.keywords && Array.isArray(faq.keywords)) {
      for (const keyword of faq.keywords) {
        if (input.includes(keyword.toLowerCase())) {
          score += 3
          matchedKeywords.push(keyword)
        }
      }
    }

    if (matchedKeywords.length > 1) {
      score += matchedKeywords.length * 2
    }

    score += (faq.priority || 1)

    if (score > highestScore) {
      highestScore = score
      bestMatch = faq
    }
  }

  if (bestMatch && highestScore > (bestMatch.priority || 1)) {
    const responseObj = bestMatch.response || {}
    const followUpObj = bestMatch.follow_up || {}
    
    const response = responseObj[t('lng')] || responseObj['en'] || ''
    const followUp = followUpObj[t('lng')] || followUpObj['en'] || ''

    return {
      response: followUp ? `${response}\n\n${followUp}` : response,
      category: bestMatch.category
    }
  }

  const yesKeywords = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'نعم', 'أجل', 'حسناً']
  if (yesKeywords.some(keyword => input === keyword || input.includes(keyword))) {
    return {
      response: t('chatbot.responses.acknowledgment_yes'),
      category: 'acknowledgment'
    }
  }

  const noKeywords = ['no', 'nope', 'nah', 'لا', 'لأ']
  if (noKeywords.some(keyword => input === keyword || input.includes(keyword))) {
    return {
      response: t('chatbot.responses.acknowledgment_no'),
      category: 'acknowledgment'
    }
  }

  return {
    response: t('chatbot.responses.clarification_needed'),
    category: 'clarification_needed'
  }
}

const ChatBot = () => {
  const params = useParams()
  const lng = params?.lng || 'en'
  const { t } = useTranslation(lng)
  
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isVerified, setIsVerified] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [storedGuestId, setStoredGuestId] = useState(null)
  
  const [faqDatabase, setFaqDatabase] = useState([])
  const [loadingFaq, setLoadingFaq] = useState(true)
  
  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const { data, error } = await supabase
          .from('faq_responses')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: false })
        
        if (error) {
          console.error('Error fetching FAQ data:', error)
          setFaqDatabase([])
        } else if (data && data.length > 0) {
          setFaqDatabase(data)
        } else {
          setFaqDatabase([])
        }
      } catch (err) {
        console.error('Error fetching FAQ data:', err)
        setFaqDatabase([])
      } finally {
        setLoadingFaq(false)
      }
    }

    fetchFaqData()
  }, [])
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setMessage({ 
        type: 'error', 
        text: t('chatbot.messages.valid_email')
      })
      return
    }
    
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { data: existingGuest, error: checkError } = await supabase
        .from('guests')
        .select('id, email, is_verified')
        .eq('email', email)
        .maybeSingle()
      
      let guestId
      
      if (existingGuest) {
        guestId = existingGuest.id
        
        if (existingGuest.is_verified) {
          setIsVerified(true)
          await initializeChatSession(guestId)
          setMessage({ 
            type: 'success', 
            text: t('chatbot.messages.welcome_back')
          })
          setLoading(false)
          return
        }
      } else {
        const { data: newGuest, error: insertError } = await supabase
          .from('guests')
          .insert([
            {
              name: name || '',
              email: email,
              is_verified: false
            }
          ])
          .select()
          .single()

        if (insertError) {
          setMessage({ 
            type: 'error', 
            text: t('chatbot.messages.failed_create_account')
          })
          setLoading(false)
          return
        }
        
        guestId = newGuest.id
      }

      setStoredGuestId(guestId)
      
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      console.log('codeeeee otp',code)

      setTimeout(() => {
        setShowCodeInput(true)
        
        setMessage({ 
          type: 'info', 
          text: `Verification code sent! For development: Your code is ${code}`
        })
        
        window.chatVerification = {
          code,
          guestId,
          email
        }
        
        setLoading(false)
      }, 1500)

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: t('chatbot.messages.error_occurred')
      })
      setLoading(false)
    }
  }


  const verifyCode = async () => {
    if (!verificationCode || !storedGuestId) {
      setMessage({ 
        type: 'error', 
        text: t('chatbot.messages.enter_verification_code_error')
      })
      return
    }
    
    setLoading(true)
    
    try {
      const stored = window.chatVerification
      console.log('windows store',stored)
      if (verificationCode === stored?.code) {
        
        const { error: updateError } = await supabase
          .from('guests')
          .update({ is_verified: true })
          .eq('id', storedGuestId)
        
        if (updateError) throw updateError
        
        setIsVerified(true)
        setMessage({ 
          type: 'success', 
          text: t('chatbot.messages.email_verified')
        })
        
        await initializeChatSession(storedGuestId)
        
        delete window.chatVerification
        
        setShowCodeInput(false)
        setVerificationCode('')
        setEmail('')
        setName('')
      } else {
        setMessage({ 
          type: 'error', 
          text: t('chatbot.messages.invalid_code')
        })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: t('chatbot.messages.verification_failed')
      })
    } finally {
      setLoading(false)
    }
  }

  // Initialize chat session
  const initializeChatSession = async (guestId) => {
    try {
      const { data: existingSession } = await supabase
        .from('sessions_chat')
        .select('id')
        .eq('guest_id', guestId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      let sessId
      
      if (existingSession) {
        sessId = existingSession.id
      } else {
        sessId = crypto.randomUUID()
        
        await supabase
          .from('sessions_chat')
          .insert([{ id: sessId, guest_id: guestId }])
          .select()
          .single()
      }
      
      setSessionId(sessId)
      await loadChatMessages(sessId)
      
    } catch (error) {
      console.error('Error in initializeChatSession:', error)
    }
  }

  // Load chat messages
  const loadChatMessages = async (sessionId) => {
    try {
      const { data } = await supabase
        .from('chatbots')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
      
      setChatMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  // Handle sending message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault()
    
    if (!inputMessage.trim() || !sessionId) return
    
    setSendingMessage(true)
    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    try {
      // Save user message to database
      const { data: messageData } = await supabase
        .from('chatbots')
        .insert([{
          session_id: sessionId,
          sender: 'guest',
          message: userMessage
        }])
        .select()
        .single()
      
      setChatMessages(prev => [...prev, messageData])
      
      // Get smart response using enhanced logic
      setTimeout(async () => {
        const { response } = findBestResponse(userMessage, faqDatabase, t)
        
        const { data: botMessage } = await supabase
          .from('chatbots')
          .insert([{
            session_id: sessionId,
            sender: 'bot',
            message: response
          }])
          .select()
          .single()
        
        if (botMessage) {
          setChatMessages(prev => [...prev, botMessage])
        }
        setSendingMessage(false)
      }, 800)
      
    } catch (error) {
      console.error('Error sending message:', error)
      setInputMessage(userMessage)
      setSendingMessage(false)
    }
  }

  // Get initial greeting message
  const getGreetingMessage = () => {
    const greetingFaq = faqDatabase.find(faq => faq.category === 'greetings')
    if (greetingFaq && greetingFaq.response) {
      const responseObj = greetingFaq.response
      return responseObj[lng] || responseObj['en'] || t('chatbot.bot_greeting')
    }
    return t('chatbot.bot_greeting')
  }

  // Check if user is already verified on mount
  useEffect(() => {
    const checkStoredVerification = async () => {
      const stored = window.chatVerification
      console.log('use effect inside stored',stored)
      if (stored?.guestId && stored?.email) {
        try {
          const { data: guest } = await supabase
            .from('guests')
            .select('is_verified')
            .eq('id', stored.guestId)
            .single()
          
          if (guest?.is_verified) {
            setIsVerified(true)
            await initializeChatSession(stored.guestId)
          }
        } catch (error) {
          // No stored verified session
        }
      }
    }
    
    if (isOpen) {
      checkStoredVerification()
    }
  }, [isOpen])

  return (
    <div className='chatbot-section'>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-[#f0a647] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-white"
        aria-label={t('chatbot.open_chat')}
      >
        <FaComments className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className={`fixed ${lng === 'ar' ? 'left-5' : 'right-5'} bottom-20 z-50 flex items-center justify-center p-4`}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[500px] flex flex-col relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className={`cursor-pointer absolute top-4 ${lng === 'ar' ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600 transition-colors z-10`}
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="bg-linear-to-r from-[#f0a647] to-[#f0a647] text-white p-4 rounded-t-2xl">
              <h3 className={`font-semibold text-lg ${lng === 'ar' ? 'text-right' : 'text-left'}`}>
                {isVerified 
                  ? t('chatbot.chat_assistant')
                  : t('chatbot.verify_email')
                }
              </h3>
              <div className={`text-xs opacity-90 mt-1 ${lng === 'ar' ? 'text-right' : 'text-left'}`}>
                {isVerified 
                  ? t('chatbot.verified_ready')
                  : t('chatbot.enter_email_for_code')
                }
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex flex-col space-y-4 p-4 overflow-y-auto flex-1 bg-gray-50">
              {!isVerified ? (
                /* Verification Interface */
                <div className="space-y-4">
                  <div className={`flex items-start ${lng === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`bg-blue-100 p-3 rounded-full ${lng === 'ar' ? 'ml-3' : 'mr-3'}`}>
                      <div className="w-6 h-6">🤖</div>
                    </div>
                    <div className={`bg-gray-100 p-4 rounded-2xl ${lng === 'ar' ? 'rounded-br-none text-right' : 'rounded-bl-none'}`}>
                      <p className="text-gray-700">
                        {showCodeInput 
                          ? t('chatbot.enter_verification_code')
                          : t('chatbot.hi_enter_email')
                        }
                      </p>
                    </div>
                  </div>
                  
                  {message.text && (
                    <div className={`p-3 rounded-lg text-sm ${lng === 'ar' ? 'text-right' : ''} ${message.type === 'success' ? 'bg-green-100 text-green-800' : message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-[#f0a647]'}`}>
                      {message.text}
                    </div>
                  )}
                  
                  {!showCodeInput ? (
                    /* Email Input */
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('chatbot.your_name_optional')}
                        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0a647] ${lng === 'ar' ? 'text-right' : ''}`}
                        disabled={loading}
                        dir={lng === 'ar' ? 'rtl' : 'ltr'}
                      />
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                          placeholder={t('chatbot.enter_your_email')}
                          className={`w-full p-3 ${lng === 'ar' ? 'pl-12' : 'pr-12'} border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f0a647] ${lng === 'ar' ? 'text-right' : ''}`}
                          required
                          disabled={loading}
                          dir={lng === 'ar' ? 'rtl' : 'ltr'}
                        />
                        <button 
                          onClick={handleSubmit}
                          disabled={loading || !email.includes('@')}
                          className={`absolute ${lng === 'ar' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 bg-[#f0a647] text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50`}
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            lng === 'ar' ? '←' : '➤'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Code Verification */
                    <div className="space-y-3">
                      <div className={`text-center ${lng === 'ar' ? 'text-right' : ''}`}>
                        <p className="text-gray-600 mb-2">
                          {t('chatbot.enter_6_digit_code_sent_to')}
                        </p>
                        <p className="font-medium">{email}</p>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          onKeyPress={(e) => e.key === 'Enter' && verificationCode.length === 6 && verifyCode()}
                          placeholder="123456"
                          className="w-full p-3 pr-12 text-center text-xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0a647]"
                          maxLength={6}
                          disabled={loading}
                        />
                        <button 
                          onClick={verifyCode}
                          disabled={loading || verificationCode.length !== 6}
                          className={`absolute ${lng === 'ar' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 bg-[#f0a647] text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50`}
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            '✓'
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => setShowCodeInput(false)}
                        className={`text-sm text-[#f0a647] hover:text-[#f0a647] ${lng === 'ar' ? 'float-right' : ''}`}
                      >
                        {t('chatbot.use_different_email')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {loadingFaq ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="w-8 h-8 border-4 border-[#f0a647] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {chatMessages.length === 0 && (
                        <div className={`flex items-start ${lng === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <div className={`bg-blue-100 p-3 rounded-full ${lng === 'ar' ? 'ml-2' : 'mr-2'} h-8 w-8 shrink-0`}>
                            <div className="text-sm">🤖</div>
                          </div>
                          <div className={`bg-gray-100 p-4 rounded-2xl ${lng === 'ar' ? 'rounded-br-none text-right' : 'rounded-bl-none'}`}>
                            <p className="text-gray-700 whitespace-pre-line">
                              {getGreetingMessage()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {chatMessages.map((msg, index) => (
                        <div key={msg.id || index} className={`flex ${msg.sender === 'guest' ? (lng === 'ar' ? 'justify-start flex-row-reverse' : 'justify-end') : (lng === 'ar' ? 'flex-row-reverse' : '')}`}>
                          {msg.sender === 'bot' && (
                            <div className={`bg-blue-100 p-2 rounded-full ${lng === 'ar' ? 'ml-2' : 'mr-2'} h-8 w-8 shrink-0`}>
                              <div className="text-sm">🤖</div>
                            </div>
                          )}
                          <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'guest' ? `bg-[#f0a647] text-white ${lng === 'ar' ? 'rounded-bl-none' : 'rounded-br-none'}` : `bg-gray-100 text-gray-700 ${lng === 'ar' ? 'rounded-br-none text-right' : 'rounded-bl-none'}`}`}>
                            <p className="text-sm whitespace-pre-line">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                      
                      {sendingMessage && (
                        <div className={`flex items-start ${lng === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <div className={`bg-blue-100 p-2 rounded-full ${lng === 'ar' ? 'ml-2' : 'mr-2'} h-8 w-8`}>
                            <div className="text-sm">🤖</div>
                          </div>
                          <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </>
              )}
            </div>

            {isVerified && (
              <div className="border-t border-gray-200 p-4">
                <div className="relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                    placeholder={t('chatbot.type_your_message')}
                    className={`w-full p-3 ${lng === 'ar' ? 'pl-12 text-right' : 'pr-12'} border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f0a647]`}
                    disabled={sendingMessage}
                    dir={lng === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !inputMessage.trim()}
                    className={`absolute ${lng === 'ar' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 bg-[#f0a647] text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50`}
                  >
                    {sendingMessage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      lng === 'ar' ? '←' : '➤'
                    )}
                  </button>
                </div>
                <p className={`text-xs text-gray-500 text-center mt-2 ${lng === 'ar' ? 'text-right' : ''}`}>
                  {t('chatbot.type_agent_human')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBot