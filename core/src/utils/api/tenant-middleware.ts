import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../supabase/server'
import { validateTenantAccess } from '../tenant'

export async function validateTenantInRequest(
  request: NextRequest,
  requestedTenantId?: string | null
): Promise<{ isValid: boolean; tenantId: string | null; isAdmin: boolean; response?: NextResponse }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      isValid: false,
      tenantId: null,
      isAdmin: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return {
      isValid: false,
      tenantId: null,
      isAdmin: false,
      response: NextResponse.json({ error: 'Profile not found' }, { status: 404 }),
    }
  }

  const userTenantId = profile.tenant_id ?? null
  const isAdmin = profile.role === 'ADMIN' || profile.role === 'admin'

  if (requestedTenantId) {
    const hasAccess = validateTenantAccess(userTenantId, requestedTenantId, isAdmin)
    if (!hasAccess) {
      return {
        isValid: false,
        tenantId: userTenantId,
        isAdmin,
        response: NextResponse.json({ error: 'Forbidden: Tenant access denied' }, { status: 403 }),
      }
    }
  }

  return {
    isValid: true,
    tenantId: userTenantId,
    isAdmin,
  }
}

export async function getTenantFromRequest(request: NextRequest): Promise<{
  tenantId: string | null
  isAdmin: boolean
  userId: string | null
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { tenantId: null, isAdmin: false, userId: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('user_id', user.id)
    .single()

  const tenantId = profile?.tenant_id ?? null
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'admin'

  return { tenantId, isAdmin, userId: user.id }
}

export function extractTenantIdFromUrl(pathname: string): string | null {
  const tenantMatch = pathname.match(/\/tenants\/([^\/]+)/)
  return tenantMatch ? tenantMatch[1] : null
}

