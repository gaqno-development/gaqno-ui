'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FeatureModule, FeaturePermissionLevel } from '@gaqno-dev/core/types/user'
import { useHasFeatureRole } from '@gaqno-dev/core/hooks/usePermissions'
import { useAuth } from '@gaqno-dev/core/hooks/useAuth'
import { formatFeatureLabel } from '@gaqno-dev/core/lib/permissions'

interface IFeatureGuardProps {
  feature: FeatureModule
  minRole?: FeaturePermissionLevel
  tenantId?: string | null
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export const FeatureGuard: React.FC<IFeatureGuardProps> = ({
  feature,
  minRole = FeaturePermissionLevel.USER,
  tenantId,
  children,
  fallback,
  redirectTo = '/dashboard',
}) => {
  const router = useRouter()
  const { loading } = useAuth()
  const hasAccess = useHasFeatureRole(feature, minRole, tenantId)

  useEffect(() => {
    if (!loading && !hasAccess) {
      if (redirectTo) {
        router.push(redirectTo)
      }
    }
  }, [hasAccess, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          You don&apos;t have access to the {formatFeatureLabel(feature)} module.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

FeatureGuard.displayName = 'FeatureGuard'

