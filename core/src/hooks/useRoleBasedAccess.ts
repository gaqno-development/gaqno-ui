import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { UserRole } from '../types/user'
import { ROUTES } from '../lib/constants'
import { isRootAdmin } from '../lib/permissions'

export const useRoleBasedAccess = (requiredRole: UserRole) => {
  const { profile, loading } = useAuth()
  const router = useRouter()

  const isAuthorized = profile?.role === requiredRole || 
                       profile?.role === UserRole.ADMIN || 
                       isRootAdmin(profile)

  useEffect(() => {
    if (!loading) {
      if (!profile) {
        router.push(ROUTES.LOGIN)
        return
      }

      if (!isAuthorized) {
        router.push(ROUTES.UNAUTHORIZED)
        return
      }
    }
  }, [profile, loading, router, isAuthorized])

  return { 
    isAuthorized: !loading && isAuthorized,
    loading,
  }
}

