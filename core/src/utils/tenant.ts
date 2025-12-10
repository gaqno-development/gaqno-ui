import { createClient } from './supabase/server'
import { IUserProfile } from '../types/user'

export async function getTenantId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  return profile?.tenant_id ?? null
}

export async function getTenantContext(): Promise<{ tenantId: string | null; isAdmin: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { tenantId: null, isAdmin: false }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('user_id', user.id)
    .single()

  const tenantId = profile?.tenant_id ?? null
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'admin'

  return { tenantId, isAdmin }
}

export function validateTenantAccess(
  userTenantId: string | null | undefined,
  requestedTenantId: string | null | undefined,
  isAdmin: boolean
): boolean {
  if (isAdmin) {
    return true
  }

  if (!userTenantId || !requestedTenantId) {
    return false
  }

  return userTenantId === requestedTenantId
}

export function requireTenantId(tenantId: string | null | undefined): asserts tenantId is string {
  if (!tenantId) {
    throw new Error('Tenant ID is required but not available')
  }
}

