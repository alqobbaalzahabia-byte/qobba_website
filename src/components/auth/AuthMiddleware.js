'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from "@/lib/supabase";

export default function AuthMiddleware({ children, lng }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          router.push(`/${lng}/login`)
          return
        }

        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('id', session.user.id)
          .single()
          console.log('from authmid',adminData)
        if (adminError || !adminData) {
          await supabase.auth.signOut()
          router.push(`/${lng}/login`)
          return
        }

        setIsAuthenticated(true)
      } catch (err) {
        console.error('Auth check error:', err)
        router.push(`/${lng}/login`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push(`/${lng}/login`)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, lng, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfef9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FAB000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}