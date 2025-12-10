import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../../types/database'
import { createClient } from './client'

type TenantSupabaseClient = SupabaseClient<Database>

export class TenantScopedClient {
  private client: TenantSupabaseClient
  private tenantId: string | null
  private isAdmin: boolean

  constructor(client: TenantSupabaseClient, tenantId: string | null, isAdmin: boolean = false) {
    this.client = client
    this.tenantId = tenantId
    this.isAdmin = isAdmin
  }

  private shouldApplyTenantFilter(): boolean {
    return !this.isAdmin && this.tenantId !== null
  }

  from<T extends keyof Database['public']['Tables']>(
    table: T
  ): TenantScopedQueryBuilder<Database['public']['Tables'][T]> {
    const query = this.client.from(table) as any
    return new TenantScopedQueryBuilder(query, this.tenantId, this.isAdmin)
  }

  rpc<T = any>(fn: string, args?: Record<string, any>): Promise<{ data: T | null; error: any }> {
    return (this.client as any).rpc(fn, args)
  }

  get auth() {
    return this.client.auth
  }

  get storage() {
    return this.client.storage
  }

  get realtime() {
    return this.client.realtime
  }
}

class TenantScopedQueryBuilder<T extends { Row: any }> {
  private query: any
  private tenantId: string | null
  private isAdmin: boolean
  private tenantFilterApplied: boolean = false

  constructor(query: any, tenantId: string | null, isAdmin: boolean) {
    this.query = query
    this.tenantId = tenantId
    this.isAdmin = isAdmin
  }

  private applyTenantFilterIfNeeded() {
    if (!this.tenantFilterApplied && !this.isAdmin && this.tenantId) {
      this.query = this.query.eq('tenant_id', this.tenantId)
      this.tenantFilterApplied = true
    }
    return this
  }

  select(columns?: string): any {
    this.applyTenantFilterIfNeeded()
    return this.query.select(columns)
  }

  insert(values: any): any {
    if (!this.isAdmin && this.tenantId) {
      const valuesWithTenant = Array.isArray(values)
        ? values.map((v) => ({ ...v, tenant_id: this.tenantId }))
        : { ...values, tenant_id: this.tenantId }
      return this.query.insert(valuesWithTenant)
    }
    return this.query.insert(values)
  }

  update(values: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.update(values)
  }

  upsert(values: any): any {
    if (!this.isAdmin && this.tenantId) {
      const valuesWithTenant = Array.isArray(values)
        ? values.map((v) => ({ ...v, tenant_id: this.tenantId }))
        : { ...values, tenant_id: this.tenantId }
      return this.query.upsert(valuesWithTenant)
    }
    return this.query.upsert(values)
  }

  delete(): any {
    this.applyTenantFilterIfNeeded()
    return this.query.delete()
  }

  eq(column: string, value: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.eq(column, value)
  }

  neq(column: string, value: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.neq(column, value)
  }

  gt(column: string, value: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.gt(column, value)
  }

  gte(column: string, value: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.gte(column, value)
  }

  lt(column: string, value: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.lt(column, value)
  }

  lte(column: string, value: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.lte(column, value)
  }

  like(column: string, pattern: string): any {
    this.applyTenantFilterIfNeeded()
    return this.query.like(column, pattern)
  }

  ilike(column: string, pattern: string): any {
    this.applyTenantFilterIfNeeded()
    return this.query.ilike(column, pattern)
  }

  is(column: string, value: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.is(column, value)
  }

  in(column: string, values: any[]): any {
    this.applyTenantFilterIfNeeded()
    return this.query.in(column, values)
  }

  contains(column: string, value: any): any {
    this.applyTenantFilterIfNeeded()
    return this.query.contains(column, value)
  }

  order(column: string, options?: { ascending?: boolean }): any {
    this.applyTenantFilterIfNeeded()
    return this.query.order(column, options)
  }

  limit(count: number): any {
    this.applyTenantFilterIfNeeded()
    return this.query.limit(count)
  }

  range(from: number, to: number): any {
    this.applyTenantFilterIfNeeded()
    return this.query.range(from, to)
  }

  single(): any {
    this.applyTenantFilterIfNeeded()
    return this.query.single()
  }

  maybeSingle(): any {
    this.applyTenantFilterIfNeeded()
    return this.query.maybeSingle()
  }
}

export function createTenantClient(
  tenantId: string | null,
  isAdmin: boolean = false
): TenantScopedClient {
  const client = createClient()
  return new TenantScopedClient(client, tenantId, isAdmin)
}

