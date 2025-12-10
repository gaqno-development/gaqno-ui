import { useMemo } from 'react'
import { useSupabaseQuery, useSupabaseMutation } from '../useSupabaseQuery'
import { ITenant } from '../../types/admin'
import { useSupabaseClient } from '../useSupabaseClient'
import { useQueryClient } from '@tanstack/react-query'

export const useTenants = () => {
    const supabase = useSupabaseClient()
    const queryClient = useQueryClient()

    const { data: tenants, isLoading, refetch } = useSupabaseQuery<ITenant[]>(
        ['tenants'],
        async () => {
            const { data, error } = await supabase
                .from('tenants')
                .select(`
                    *,
                    whitelabel_configs (
                        logo_url,
                        company_name,
                        app_name,
                        primary_color,
                        secondary_color
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data || []
        }
    )

    const createMutation = useSupabaseMutation<ITenant, Partial<ITenant>>(
        async (tenantData) => {
            const { data, error } = await supabase
                .from('tenants')
                .insert(tenantData)
                .select()
                .single()

            if (error) throw error
            return data
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['tenants'] })
            }
        }
    )

    const updateMutation = useSupabaseMutation<ITenant, { id: string; data: Partial<ITenant> }>(
        async ({ id, data }) => {
            const { data: updatedTenant, error } = await supabase
                .from('tenants')
                .update(data)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return updatedTenant
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['tenants'] })
            }
        }
    )

    const deleteMutation = useSupabaseMutation<void, string>(
        async (id) => {
            const { error } = await supabase
                .from('tenants')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['tenants'] })
            }
        }
    )

    const createTenant = async (data: Partial<ITenant>) => {
        try {
            await createMutation.mutateAsync(data)
            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }

    const updateTenant = async (id: string, data: Partial<ITenant>) => {
        try {
            await updateMutation.mutateAsync({ id, data })
            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }

    const deleteTenant = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id)
            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }

    return {
        tenants,
        isLoading,
        createTenant,
        updateTenant,
        deleteTenant,
        refetch
    }
}

