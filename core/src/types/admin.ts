export interface ITenant {
    id: string
    tenant_id: string
    name: string
    domain: string
    status: 'active' | 'inactive' | 'trial'
    max_users: number
    user_count: number
    created_at: string
    updated_at: string
    whitelabel_configs?: {
        logo_url: string | null
        company_name: string | null
        app_name: string | null
        primary_color: string | null
        secondary_color: string | null
    } | null
}

export interface IBrandingConfig {
    id: string
    tenant_id: string
    company_name: string
    logo_url: string | null
    favicon_url: string | null
    primary_color: string
    secondary_color: string
    font_family: string | null
    app_name: string | null
    custom_css: string | null
    created_at: string
    updated_at: string
}

export interface IDomain {
    id: string
    tenant_id: string
    name: string
    verified: boolean
    ssl_certificate: boolean
    created_at: string
    updated_at: string
}

export interface IFeature {
    id: string
    name: string
    key: string
    description: string
    category: string
    enabled: boolean
    tiers?: string[]
    dependencies?: string[]
}

export interface ITenantFeature {
    id: string
    tenant_id: string
    feature_id: string
    enabled: boolean
    created_at: string
    updated_at: string
}

export interface IUsageData {
    totalUsers: number
    newUsers: number
    activeUsers: number
    activePercentage: number
    apiCalls: number
    apiCallsChange: number
    storageUsed: number
    storagePercentage: number
    chartData: IChartDataPoint[]
}

export interface IChartDataPoint {
    date: string
    value: number
    label: string
}

export interface IUserActivity {
    date: string
    activeUsers: number
    sessionDuration: number
}

export interface IFeatureUsage {
    feature: string
    usage: number
    percentage: number
    trend: 'up' | 'down' | 'stable'
}

