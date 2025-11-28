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
  const [sessionId, setSessionId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  
  // Load chat messages from database
  const loadChatMessages = async (sessionId) => {
    try {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error loading messages:', error);
      } else if (data) {
        setChatMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  // send otp to the user on email
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!email || !email.includes('@')) {
      return
    }
    
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { error: insertError } = await supabase
        .from('guests')
        .insert([
          {
            name: name || '',
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

        if (!error) {
          setMessage({ 
            type: 'success', 
            text: t('chatbot.otpSent')
          })
          setName('')
          setEmail('')
        } else {
          setMessage({ 
            type: 'error', 
            text: t('chatbot.tryAgain')
          })
        }
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
      
      if (isEmailVerified && userEmail) {
        // Update guest verification status
        const { data: updatedUser, error: updateError } = await supabase
          .from('guests')
          .update({ is_verified: true })
          .eq('email', userEmail)
          .select();
        
        if (updateError) {
          console.error('Update error:', updateError);
        } else if (updatedUser && updatedUser.length > 0) {
          setIsVerified(true)
          // get guest_id(fk) from updated user 
          const guestId = updatedUser[0].id;
          
          // Check if session already exists for this guest
          const { data: existingSession, error: sessionError } = await supabase
            .from('sessions_chat')
            .select('id')
            .eq('guest_id', guestId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          let sessId;
          
          if (existingSession && !sessionError) {
            // Use existing session
            sessId = existingSession.id;
            setSessionId(sessId);
            
            // Load existing messages
            await loadChatMessages(sessId);
          } else {
            // Create new session
            sessId = crypto.randomUUID();
            
            // Insert into sessions_chat 
            const { data: sessionChatData, error: sessionChatError } = await supabase
              .from('sessions_chat')
              .insert([
                {
                  id: sessId,
                  guest_id: guestId
                }
              ])
              .select();
            
            if (sessionChatError) {
              console.error('Error inserting into sessions_chat:', sessionChatError);
            } else {
              console.log('Session chat created:', sessionChatData);
              setSessionId(sessId);
            }
          }
        }
      }
    }
    getAuthData()
  }, [])

  // Handle sending a message
  const handleSendMessage = async (e) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!inputMessage.trim() || !sessionId || !isVerified) {
      return
    }
    
    setSendingMessage(true)
    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    try {
      // Save user message to database
      const { data: messageData, error: messageError } = await supabase
        .from('chatbots')
        .insert([
          {
            session_id: sessionId,
            sender: 'guest',
            message: userMessage
          }
        ])
        .select()
        .single();
      
      if (messageError) {
        console.error('Error saving message:', messageError);
        setInputMessage(userMessage) // Restore message on error
      } else {
        // Add message to chat
        setChatMessages(prev => [...prev, messageData]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setInputMessage(userMessage) // Restore message on error
    } finally {
      setSendingMessage(false)
    }
  }

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

      {/* modal for chatbot if the user is verified */}
      {isOpen  && (
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
              {0 ? (
                /* Not Verified Message */
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="flex items-end mb-4">
                    <div className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 order-2 items-start">
                      <div>
                        <span className="px-4 py-3 rounded-xl inline-block rounded-bl-none bg-gray-100 text-gray-600">
                          {t('chatbot.notVerifiedMessage')}
                        </span>
                      </div>
                    </div>
                    <img
                      src="https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                      alt="bot"
                      className="w-6 h-6 rounded-full order-1"
                    />
                  </div>
                  {message.text && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-sm ${
                        message.type === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Show bot greeting if no messages */}
                  {chatMessages.length === 0 && (
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
                  )}
                  
                  {/* Display chat messages */}
                  {chatMessages.map((msg, index) => (
                    <div key={msg.id || index}>
                      {msg.sender === 'guest' ? (
                        <div className="flex items-end justify-end">
                          <div className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 order-1 items-end">
                            <div>
                              <span className="px-4 py-3 rounded-xl inline-block rounded-br-none bg-blue-500 text-white">
                                {msg.message}
                              </span>
                            </div>
                          </div>
                          <img
                            src="https://i.pravatar.cc/100?img=7"
                            alt="user"
                            className="w-6 h-6 rounded-full order-2"
                          />
                        </div>
                      ) : (
                        <div className="flex items-end">
                          <div className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 order-2 items-start">
                            <div>
                              <span className="px-4 py-3 rounded-xl inline-block rounded-bl-none bg-gray-100 text-gray-600">
                                {msg.message}
                              </span>
                            </div>
                          </div>
                          <img
                            src="https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                            alt="bot"
                            className="w-6 h-6 rounded-full order-1"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t-2 border-gray-200 px-4 pt-4 pb-4">
              {!isVerified ? (
                <form onSubmit={handleSubmit} className="relative flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('chatbot.enterEmailToVerify')}
                    className="text-md w-full focus:outline-none text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2"
                    required
                  />
                  <div className="absolute right-2 inset-y-0 flex items-center">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-full h-8 w-8 text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ➤
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSendMessage} className="relative flex">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={t('chatbot.inputPlaceholder')}
                    className="text-md w-full focus:outline-none text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2"
                    disabled={sendingMessage || !sessionId}
                  />
                  <div className="absolute right-2 inset-y-0 flex items-center">
                    <button 
                      type="submit"
                      disabled={sendingMessage || !inputMessage.trim() || !sessionId}
                      className="inline-flex items-center justify-center rounded-full h-8 w-8 text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ➤
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ChatBot

