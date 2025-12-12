'use client'

import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import OverlayRight from '@/../public/assets/about-overlay.png'
import { supabase } from "@/lib/supabase"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from '@/app/i18n/client'
import Input from '@/components/ui/Input'

const createLoginSchema = (t) => z.object({
  email: z
    .string()
    .min(1, t('login.fieldRequired'))
    .email(t('login.fieldRequired')),
  password: z
    .string()
    .min(1, t('login.fieldRequired')),
})

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const params = useParams()
  const lng = params?.lng || 'en'
  const { t } = useTranslation(lng, 'common')

  const loginSchema = useMemo(() => createLoginSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setError(t('login.invalidCredentials'))
        setLoading(false)
        return
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', authData.user.id)
        .single()
          console.log('from login page',adminData)
          console.log('from login page error',adminError)


      if (adminError || !adminData) {
        await supabase.auth.signOut()
        setError(t('login.noAdminAccess'))
        setLoading(false)
        return
      }

      localStorage.setItem('adminToken', 'authenticated')
      localStorage.setItem('adminEmail', authData.user.email)
      localStorage.setItem('adminId', authData.user.id)
      
      router.push(`/${lng}/dashboard`)
    } catch (err) {
      console.error('Login error:', err)
      setError(t('login.errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src={OverlayRight}
          alt="Background overlay"
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#572b0a] mb-2">{t('login.title')}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            type="email"
            label={t('login.email')}
            placeholder={t('login.emailPlaceholder')}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            type="password"
            label={t('login.password')}
            placeholder={t('login.passwordPlaceholder')}
            error={errors.password?.message}
            {...register('password')}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-[#f0a647] to-[#FAB000] text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>
      </div>
    </div>
  )
}