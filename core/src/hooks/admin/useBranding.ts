import { useMemo } from 'react'
import { useSupabaseQuery, useSupabaseMutation } from '../useSupabaseQuery'
import { IBrandingConfig } from '../../types/admin'
import { useSupabaseClient } from '../useSupabaseClient'
import { useQueryClient } from '@tanstack/react-query'

export const useBranding = (tenantId: string) => {
    const supabase = useSupabaseClient()
    const queryClient = useQueryClient()

    const { data: brandingConfig, isLoading, refetch } = useSupabaseQuery<IBrandingConfig | null>(
        ['branding', tenantId],
        async () => {
            const { data, error } = await supabase
                .from('whitelabel_configs')
                .select('*')
                .eq('tenant_id', tenantId)
                .single()

            if (error && error.code !== 'PGRST116') throw error

            if (error && error.code === 'PGRST116') {
                return {
                    id: '',
                    tenant_id: tenantId,
                    logo_url: null,
                    favicon_url: null,
                    primary_color: '#000000',
                    secondary_color: '#ffffff',
                    font_family: null,
                    app_name: null,
                    custom_css: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            }

            return data
        },
        {
            enabled: !!tenantId
        }
    )

    const updateMutation = useSupabaseMutation<IBrandingConfig, Partial<IBrandingConfig>>(
        async (data) => {
            let result

            if (brandingConfig?.id) {
                const { data: updatedBranding, error } = await supabase
                    .from('whitelabel_configs')
                    .update(data)
                    .eq('id', brandingConfig.id)
                    .select()
                    .single()

                if (error) throw error
                result = updatedBranding
            } else {
                const { data: newBranding, error } = await supabase
                    .from('whitelabel_configs')
                    .insert({ ...data, tenant_id: tenantId })
                    .select()
                    .single()

                if (error) throw error
                result = newBranding
            }

            return result
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['branding', tenantId] })
            }
        }
    )

    const updateBranding = async (data: Partial<IBrandingConfig>) => {
        try {
            await updateMutation.mutateAsync(data)
            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }

    return {
        brandingConfig,
        isLoading,
        updateBranding,
        refetch
    }
}

