import { useMemo } from 'react'
import { useSupabaseQuery, useSupabaseMutation } from '../useSupabaseQuery'
import { IFeature, ITenantFeature } from '../../types/admin'
import { useSupabaseClient } from '../useSupabaseClient'
import { useQueryClient } from '@tanstack/react-query'

export const useFeatures = (tenantId: string) => {
    const supabase = useSupabaseClient()
    const queryClient = useQueryClient()

    const { data: allFeatures, isLoading: isLoadingFeatures } = useSupabaseQuery<IFeature[]>(
        ['features'],
        async () => {
            const { data, error } = await supabase
                .from('features')
                .select('*')
                .order('category', { ascending: true })

            if (error) throw error
            return data || []
        }
    )

    const { data: tenantFeatures, isLoading: isLoadingTenantFeatures } = useSupabaseQuery<ITenantFeature[]>(
        ['tenant-features', tenantId],
        async () => {
            const { data, error } = await supabase
                .from('tenant_features')
                .select('*')
                .eq('tenant_id', tenantId)

            if (error) throw error
            return data || []
        },
        {
            enabled: !!tenantId
        }
    )

    const updateMutation = useSupabaseMutation<ITenantFeature, { featureId: string; enabled: boolean }>(
        async ({ featureId, enabled }) => {
            const existing = tenantFeatures?.find(tf => tf.feature_id === featureId)

            if (existing) {
                const { data, error } = await supabase
                    .from('tenant_features')
                    .update({ enabled })
                    .eq('id', existing.id)
                    .select()
                    .single()

                if (error) throw error
                return data
            } else {
                const { data, error } = await supabase
                    .from('tenant_features')
                    .insert({
                        tenant_id: tenantId,
                        feature_id: featureId,
                        enabled
                    })
                    .select()
                    .single()

                if (error) throw error
                return data
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['tenant-features', tenantId] })
            }
        }
    )

    const mergedFeatures = useMemo(() => {
        if (!allFeatures) return []

        return allFeatures.map(feature => {
            const tenantFeature = tenantFeatures?.find(tf => tf.feature_id === feature.id)
            return {
                ...feature,
                enabled: tenantFeature?.enabled ?? false
            }
        })
    }, [allFeatures, tenantFeatures])

    const updateFeature = async (featureId: string, data: { enabled: boolean }) => {
        try {
            await updateMutation.mutateAsync({ featureId, enabled: data.enabled })
            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }

    return {
        features: mergedFeatures,
        isLoading: isLoadingFeatures || isLoadingTenantFeatures,
        updateFeature
    }
}

