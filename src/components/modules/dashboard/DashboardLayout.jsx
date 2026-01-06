'use client'
import { useSession } from '@/lib/auth'
import { usePathname, useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const { user, logout } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/signin')
  }

  if (pathname.startsWith('/dashboard/admin') || pathname.startsWith(`/dashboard/${user?.role}/orders`)) {
    return <>{children}</>
  }

  return (
    <div className="mt-24">
      <div className="">
        {children}
      </div>
    </div>
  )
}