'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthMiddleware({ children, lng }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        router.push(`/${lng}/login`)
      } else {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
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