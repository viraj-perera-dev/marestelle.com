'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LogoutButton({ locale }) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    router.push(`/${locale}`)
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-red-600 hover:text-red-700 transition"
    >
      Logout
    </button>
  )
}