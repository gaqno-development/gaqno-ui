import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@gaqno-dev/core/hooks/useAuth'
import { useWhiteLabel } from '@gaqno-dev/core/hooks/useWhiteLabel'
import { useBranding } from '@gaqno-dev/core/hooks/admin/useBranding'
import { ROUTES } from '@gaqno-dev/core/lib/constants'
import { useMemo } from 'react'

export const useHeader = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut, profile } = useAuth()
  const { config: whiteLabelConfig } = useWhiteLabel()

  // Extract tenant ID from pathname if we're on a tenant details page
  const tenantIdFromPath = useMemo(() => {
    const match = pathname.match(/\/admin\/tenants\/([^\/]+)/)
    return match ? match[1] : null
  }, [pathname])

  // Get branding config for the tenant being viewed (if any)
  const { brandingConfig: viewedTenantBranding } = useBranding(tenantIdFromPath || '')

  // Use viewed tenant branding if we're on a tenant details page, otherwise use global config
  const displayConfig = tenantIdFromPath && viewedTenantBranding ? viewedTenantBranding : whiteLabelConfig

  const handleSignOut = async () => {
    await signOut()
    router.push(ROUTES.LOGIN)
  }

  return {
    profile,
    whiteLabelConfig: displayConfig,
    handleSignOut,
  }
}

