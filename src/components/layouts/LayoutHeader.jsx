'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ChatBot from '@/components/common/ChatBot'

export default function ConditionalLayout({ children, lng }) {
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/dashboard')
  const isLogin = pathname?.includes('/login')

  if (isDashboard || isLogin) {
    return <>{children}</>
  }

  return (
    <div className='wrapper flex flex-col'>
      <Header lng={lng} />
      <div className='content flex-1'>
        {children}
      </div>
      {/* <ChatBot lng={lng} /> */}
      <Footer lng={lng} />
    </div>
  )
}

