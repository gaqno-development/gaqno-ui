import { useMemo } from 'react'
import { useSupabaseQuery } from '../useSupabaseQuery'
import { IUsageData, IUserActivity, IFeatureUsage } from '../../types/admin'
import { useSupabaseClient } from '../useSupabaseClient'

export const useAnalytics = (tenantId: string, timeRange: string = '30d') => {
    const supabase = useSupabaseClient()

    const { data: usageData, isLoading: isLoadingUsage } = useSupabaseQuery<IUsageData>(
        ['analytics-usage', tenantId, timeRange],
        async () => {
            const { data, error } = await supabase
                .rpc('get_tenant_usage_data', {
                    p_tenant_id: tenantId,
                    p_time_range: timeRange
                })

            if (error) {
                return {
                    totalUsers: 0,
                    newUsers: 0,
                    activeUsers: 0,
                    activePercentage: 0,
                    apiCalls: 0,
                    apiCallsChange: 0,
                    storageUsed: 0,
                    storagePercentage: 0,
                    chartData: []
                }
            }

            return data || {
                totalUsers: 0,
                newUsers: 0,
                activeUsers: 0,
                activePercentage: 0,
                apiCalls: 0,
                apiCallsChange: 0,
                storageUsed: 0,
                storagePercentage: 0,
                chartData: []
            }
        },
        {
            enabled: !!tenantId
        }
    )

    const { data: userActivityData, isLoading: isLoadingActivity } = useSupabaseQuery<IUserActivity[]>(
        ['analytics-activity', tenantId, timeRange],
        async () => {
            const { data, error } = await supabase
                .rpc('get_user_activity_data', {
                    p_tenant_id: tenantId,
                    p_time_range: timeRange
                })

            if (error) return []
            return data || []
        },
        {
            enabled: !!tenantId
        }
    )

    const { data: featureUsageData, isLoading: isLoadingFeatureUsage } = useSupabaseQuery<IFeatureUsage[]>(
        ['analytics-features', tenantId, timeRange],
        async () => {
            const { data, error } = await supabase
                .rpc('get_feature_usage_data', {
                    p_tenant_id: tenantId,
                    p_time_range: timeRange
                })

            if (error) return []
            return data || []
        },
        {
            enabled: !!tenantId
        }
    )

    return {
        usageData: usageData || {
            totalUsers: 0,
            newUsers: 0,
            activeUsers: 0,
            activePercentage: 0,
            apiCalls: 0,
            apiCallsChange: 0,
            storageUsed: 0,
            storagePercentage: 0,
            chartData: []
        },
        userActivityData: userActivityData || [],
        featureUsageData: featureUsageData || [],
        isLoading: isLoadingUsage || isLoadingActivity || isLoadingFeatureUsage
    }
}

