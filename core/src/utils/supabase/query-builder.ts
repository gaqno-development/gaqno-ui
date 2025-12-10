import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../../types/database'

type TenantQueryOptions = {
  tenantId: string | null
  isAdmin: boolean
  table: keyof Database['public']['Tables']
}

export function withTenantScope<T>(
  client: SupabaseClient<Database>,
  options: TenantQueryOptions,
  queryFn: (scopedQuery: any) => Promise<T>
): Promise<T> {
  const { tenantId, isAdmin, table } = options
  let query = client.from(table) as any

  if (!isAdmin && tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  return queryFn(query)
}

export function ensureTenantId<T extends Record<string, any>>(
  data: T,
  tenantId: string | null,
  isAdmin: boolean
): T {
  if (isAdmin || !tenantId) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map((item) => ({ ...item, tenant_id: tenantId })) as unknown as T
  }

  return { ...data, tenant_id: tenantId }
}

export function validateTenantAccessForOperation(
  userTenantId: string | null | undefined,
  dataTenantId: string | null | undefined,
  isAdmin: boolean
): boolean {
  if (isAdmin) {
    return true
  }

  if (!userTenantId || !dataTenantId) {
    return false
  }

  return userTenantId === dataTenantId
}

