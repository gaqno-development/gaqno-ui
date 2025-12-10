import { useMemo } from 'react'
import { useSupabaseQuery, useSupabaseMutation } from '../useSupabaseQuery'
import { IDomain } from '../../types/admin'
import { useSupabaseClient } from '../useSupabaseClient'
import { useQueryClient } from '@tanstack/react-query'

export const useDomains = (tenantId: string) => {
    const supabase = useSupabaseClient()
    const queryClient = useQueryClient()

    const { data: domains, isLoading, refetch } = useSupabaseQuery<IDomain[]>(
        ['domains', tenantId],
        async () => {
            const { data, error } = await supabase
                .from('domains')
                .select('*')
                .eq('tenant_id', tenantId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data || []
        },
        {
            enabled: !!tenantId
        }
    )

    const createMutation = useSupabaseMutation<IDomain, Partial<IDomain>>(
        async (domainData) => {
            const { data, error } = await supabase
                .from('domains')
                .insert({ ...domainData, tenant_id: tenantId })
                .select()
                .single()

            if (error) throw error
            return data
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['domains', tenantId] })
            }
        }
    )

    const updateMutation = useSupabaseMutation<IDomain, { id: string; data: Partial<IDomain> }>(
        async ({ id, data }) => {
            const { data: updatedDomain, error } = await supabase
                .from('domains')
                .update(data)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return updatedDomain
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['domains', tenantId] })
            }
        }
    )

    const deleteMutation = useSupabaseMutation<void, string>(
        async (id) => {
            const { error } = await supabase
                .from('domains')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['domains', tenantId] })
            }
        }
    )

    const createDomain = async (data: Partial<IDomain>) => {
        try {
            await createMutation.mutateAsync(data)
            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }

    const updateDomain = async (id: string, data: Partial<IDomain>) => {
        try {
            await updateMutation.mutateAsync({ id, data })
            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }

    const deleteDomain = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id)
            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }

    const verifyDomain = async (id: string) => {
        return await updateDomain(id, { verified: true })
    }

    return {
        domains,
        isLoading,
        createDomain,
        updateDomain,
        deleteDomain,
        verifyDomain,
        refetch
    }
}

