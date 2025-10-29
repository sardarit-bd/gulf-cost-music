'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from '@/lib/auth';

export default function DashboardPage() {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (loading) return 

    if (!user) {

      router.replace('/signin')
      return
    }

   
    switch (user.userType?.toLowerCase()) {
      case 'artist':
        router.replace('/dashboard/artist')
        break
      case 'venue':
        router.replace('/dashboard/venue')
        break
      case 'journalist':
        router.replace('/dashboard/journalist')
        break
      case 'admin':
        router.replace('/dashboard/admin')
        break
      default:
        router.replace('/')
    }
  }, [user, loading, router])


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-yellow-400">
        <div className="text-xl animate-pulse">Checking your session...</div>
      </div>
    )
  }

  return null
}
