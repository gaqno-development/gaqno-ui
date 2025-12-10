import { 
  FeatureModule, 
  FeaturePermissionLevel, 
  IUserProfile,
  IFeaturePermissionMap 
} from '../types/user'
import { 
  IPermissionCheckParams, 
  IFeatureAccessResult,
  hasMinimumRole,
  PERMISSION_HIERARCHY 
} from '../types/permissions'

export const isRootAdmin = (user: IUserProfile | null | undefined): boolean => {
  return user?.is_root_admin === true
}

export const hasFeatureAccess = (
  user: IUserProfile | null | undefined,
  feature: FeatureModule,
  tenantId?: string | null
): boolean => {
  if (!user) return false
  
  if (isRootAdmin(user)) return true
  
  if (!user.feature_permissions) return false
  
  const featurePerms = user.feature_permissions[feature]
  if (!featurePerms) return false
  
  if (tenantId && featurePerms.tenant_id && featurePerms.tenant_id !== tenantId) {
    return false
  }
  
  return featurePerms.roles && featurePerms.roles.length > 0
}

export const hasFeatureRole = (
  user: IUserProfile | null | undefined,
  feature: FeatureModule,
  minRole: FeaturePermissionLevel,
  tenantId?: string | null
): boolean => {
  if (!user) return false
  
  if (isRootAdmin(user)) return true
  
  if (!hasFeatureAccess(user, feature, tenantId)) return false
  
  const featurePerms = user.feature_permissions?.[feature]
  if (!featurePerms || !featurePerms.roles) return false
  
  return featurePerms.roles.some(role => hasMinimumRole(role, minRole))
}

export const canManageFeatureRoles = (
  user: IUserProfile | null | undefined,
  feature: FeatureModule,
  tenantId?: string | null
): boolean => {
  return hasFeatureRole(user, feature, FeaturePermissionLevel.ADMIN, tenantId)
}

export const getFeaturePermissions = (
  user: IUserProfile | null | undefined
): IFeaturePermissionMap => {
  if (!user) return {}
  
  if (isRootAdmin(user)) {
    return Object.values(FeatureModule).reduce((acc, feature) => {
      if (feature !== FeatureModule.SYSTEM) {
        acc[feature] = {
          roles: [FeaturePermissionLevel.ADMIN],
          tenant_id: null,
        }
      }
      return acc
    }, {} as IFeaturePermissionMap)
  }
  
  return user.feature_permissions || {}
}

export const getUserFeatureRoles = (
  user: IUserProfile | null | undefined,
  feature: FeatureModule
): FeaturePermissionLevel[] => {
  if (!user) return []
  
  if (isRootAdmin(user)) {
    return [FeaturePermissionLevel.ADMIN]
  }
  
  const featurePerms = user.feature_permissions?.[feature]
  return featurePerms?.roles || []
}

export const getHighestFeatureRole = (
  user: IUserProfile | null | undefined,
  feature: FeatureModule
): FeaturePermissionLevel | null => {
  const roles = getUserFeatureRoles(user, feature)
  if (roles.length === 0) return null
  
  return roles.reduce((highest, current) => {
    return PERMISSION_HIERARCHY[current] > PERMISSION_HIERARCHY[highest] ? current : highest
  })
}

export const getAccessibleFeatures = (
  user: IUserProfile | null | undefined
): FeatureModule[] => {
  if (!user) return []
  
  if (isRootAdmin(user)) {
    return Object.values(FeatureModule).filter(f => f !== FeatureModule.SYSTEM)
  }
  
  if (!user.feature_permissions) return []
  
  return Object.keys(user.feature_permissions)
    .filter(key => {
      const perms = user.feature_permissions?.[key]
      return perms && perms.roles && perms.roles.length > 0
    })
    .map(key => key as FeatureModule)
}

export const canAccessRoute = (
  user: IUserProfile | null | undefined,
  route: string
): boolean => {
  if (!user) return false
  
  if (isRootAdmin(user)) return true
  
  const routeFeatureMap: Record<string, { feature: FeatureModule; minRole: FeaturePermissionLevel }> = {
    '/dashboard/finance': { feature: FeatureModule.FINANCE, minRole: FeaturePermissionLevel.ACCESS },
    '/dashboard/crm': { feature: FeatureModule.CRM, minRole: FeaturePermissionLevel.USER },
    '/dashboard/erp': { feature: FeatureModule.ERP, minRole: FeaturePermissionLevel.USER },
    '/dashboard/pdv': { feature: FeatureModule.PDV, minRole: FeaturePermissionLevel.USER },
    '/admin': { feature: FeatureModule.SYSTEM, minRole: FeaturePermissionLevel.ADMIN },
  }
  
  for (const [routePrefix, config] of Object.entries(routeFeatureMap)) {
    if (route.startsWith(routePrefix)) {
      if (config.feature === FeatureModule.SYSTEM) {
        return isRootAdmin(user)
      }
      return hasFeatureRole(user, config.feature, config.minRole)
    }
  }
  
  return true
}

export const formatFeatureLabel = (feature: FeatureModule): string => {
  const labels: Record<FeatureModule, string> = {
    [FeatureModule.SYSTEM]: 'Sistema',
    [FeatureModule.CRM]: 'CRM',
    [FeatureModule.FINANCE]: 'Finanças',
    [FeatureModule.ERP]: 'ERP',
    [FeatureModule.PDV]: 'PDV',
    [FeatureModule.BOOK_CREATOR]: 'Criador de Livros',
  }
  return labels[feature] || feature
}

export const formatRoleLabel = (role: FeaturePermissionLevel): string => {
  const labels: Record<FeaturePermissionLevel, string> = {
    [FeaturePermissionLevel.ADMIN]: 'Administrador',
    [FeaturePermissionLevel.MANAGER]: 'Gerente',
    [FeaturePermissionLevel.USER]: 'Usuário',
    [FeaturePermissionLevel.ACCESS]: 'Acesso',
  }
  return labels[role] || role
}
