'use client'

import { useState,useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Button from '../../../components/ui/Button'

export default function LoginForm({ lng }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  async function handleRequestOtp(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
      })

      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to send OTP' })
      } else {
        setMessage({ type: 'success', text: 'OTP sent to your email! Please check your inbox.' })
        setOtpSent(true)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    async function getAuthData() {
      try {
        // Get current session data
        const { data: sessionData, error } = await supabase.auth.getSession()
        
        if (sessionData?.session) {
          const isEmailVerified = sessionData.session.user.user_metadata?.email_verified
          // Get from localStorage if exists
          const storedToken = localStorage.getItem('sb-jmzlluecfhacxxnrmcds-auth-token')
          console.log('Current Auth Data:', isEmailVerified)

        } else {
          console.log('No active session found')
        }
      } catch (error) {
        console.error('Error getting auth data:', error)
      }
    }
    
    getAuthData()
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-[#572b0a] mb-6">Login</h2>
      
      {!otp && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#572b0a] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#572b0a] focus:border-transparent"
              placeholder="your.email@example.com"
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
            className="w-full bg-[#572b0a] text-white py-3 px-6 rounded-lg hover:bg-[#6b3512] font-medium"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      )}
    </div>
  )
}

