'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useIsRootAdmin } from '@gaqno-dev/core/hooks/usePermissions'
import { useAuth } from '@gaqno-dev/core/hooks/useAuth'

interface IRootAdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export const RootAdminGuard: React.FC<IRootAdminGuardProps> = ({
  children,
  fallback,
  redirectTo = '/dashboard',
}) => {
  const router = useRouter()
  const { loading } = useAuth()
  const isRootAdmin = useIsRootAdmin()

  useEffect(() => {
    if (!loading && !isRootAdmin) {
      if (redirectTo) {
        router.push(redirectTo)
      }
    }
  }, [isRootAdmin, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isRootAdmin) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          You need Root Administrator privileges to access this area.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

RootAdminGuard.displayName = 'RootAdminGuard'

