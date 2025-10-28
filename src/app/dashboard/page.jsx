'use client'
import { useSession } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in → redirect to signin
        router.push('/signin')
      } else {
        // Logged in → redirect based on role
        switch (user.userType) { // your backend uses "userType"
          case 'artist':
            router.push('/dashboard/artist')
            break
          case 'venue':
            router.push('/dashboard/venue')
            break
          case 'journalist':
            router.push('/dashboard/journalist')
            break
          case 'admin':
            router.push('/dashboard/admin')
            break
          default:
            router.push('/')
        }
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return null
}
