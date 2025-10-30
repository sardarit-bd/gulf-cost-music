'use client'
import { useSession } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const { user, logout } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/signin')
  }

  if (pathname.startsWith('/dashboard/admin')) {
    return <>{children}</>
  }

  return (
    <div className="mt-32">
      <div className="container mx-auto sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
