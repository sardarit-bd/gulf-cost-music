'use client'
import { useSession } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const { user, logout } = useSession()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/signin')
  }

  return (
    <div className="mt-32">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Gulf Coast Music Dashboard
              </h1>
              {user && (
                <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {user.userType?.charAt(0).toUpperCase() + user.userType?.slice(1)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user && <span className="text-gray-700">Welcome, {user.username}</span>}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header> */}

      <div className="container mx-auto sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
