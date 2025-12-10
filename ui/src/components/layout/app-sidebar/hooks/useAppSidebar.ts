import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  Settings, 
  FolderKanban, 
  Building, 
  Wallet,
  TrendingUp,
  Wrench,
  BookOpen,
} from 'lucide-react'
import { FeatureModule, FeaturePermissionLevel } from '@gaqno-dev/core/types/user'
import { ISidebarItem } from '../types'
import { usePermissions } from '@gaqno-dev/core/hooks/usePermissions'
import { useTenant } from '@gaqno-dev/core/contexts'

export const useAppSidebar = () => {
  const pathname = usePathname()
  const { isRootAdmin, hasAccess, hasRole } = usePermissions()
  const { tenantId } = useTenant()

  const adminGroup: ISidebarItem | null = isRootAdmin
    ? {
        label: 'Administração',
        icon: Settings,
        isCollapsible: true,
        children: [
          {
            label: 'Usuários',
            href: '/dashboard/users',
            icon: Users,
          },
          {
            label: 'Tenants',
            href: '/admin/tenants',
            icon: Building,
          },
          {
            label: 'Gerenciamento',
            href: '/dashboard/manager',
            icon: FolderKanban,
          },
        ],
      }
    : null

  const financeGroup: ISidebarItem | null = hasAccess(FeatureModule.FINANCE, tenantId)
    ? {
        label: 'Finanças',
        icon: Wallet,
        isCollapsible: true,
        children: [
          {
            label: 'Dashboard',
            href: '/dashboard/finance',
            icon: Home,
          },
          {
            label: 'Investimentos',
            href: '/dashboard/finance/investments',
            icon: TrendingUp,
          },
          {
            label: 'Configurações',
            href: '/dashboard/finance/settings',
            icon: Settings,
          },
        ].filter(item => {
          if (item.href === '/dashboard/finance/settings') {
            return hasRole(FeatureModule.FINANCE, FeaturePermissionLevel.ADMIN, tenantId)
          }
          return true
        }),
      }
    : null

  const crmGroup: ISidebarItem | null = hasAccess(FeatureModule.CRM, tenantId)
    ? {
        label: 'CRM',
        icon: Users,
        isCollapsible: true,
        children: [
          {
            label: 'Dashboard',
            href: '/dashboard/crm',
            icon: Home,
          },
          {
            label: 'Contacts',
            href: '/dashboard/crm/contacts',
            icon: Users,
          },
          {
            label: 'Settings',
            href: '/dashboard/crm/settings',
            icon: Settings,
          },
        ].filter(item => {
          if (item.href === '/dashboard/crm/settings') {
            return hasRole(FeatureModule.CRM, FeaturePermissionLevel.ADMIN, tenantId)
          }
          return true
        }),
      }
    : null

  const erpGroup: ISidebarItem | null = hasAccess(FeatureModule.ERP, tenantId)
    ? {
        label: 'ERP',
        icon: FolderKanban,
        isCollapsible: true,
        children: [
          {
            label: 'Dashboard',
            href: '/dashboard/erp',
            icon: Home,
          },
          {
            label: 'Settings',
            href: '/dashboard/erp/settings',
            icon: Settings,
          },
        ].filter(item => {
          if (item.href === '/dashboard/erp/settings') {
            return hasRole(FeatureModule.ERP, FeaturePermissionLevel.ADMIN, tenantId)
          }
          return true
        }),
      }
    : null

  const pdvGroup: ISidebarItem | null = hasAccess(FeatureModule.PDV, tenantId)
    ? {
        label: 'PDV',
        icon: Wrench,
        isCollapsible: true,
        children: [
          {
            label: 'Dashboard',
            href: '/dashboard/pdv',
            icon: Home,
          },
          {
            label: 'Settings',
            href: '/dashboard/pdv/settings',
            icon: Settings,
          },
        ].filter(item => {
          if (item.href === '/dashboard/pdv/settings') {
            return hasRole(FeatureModule.PDV, FeaturePermissionLevel.ADMIN, tenantId)
          }
          return true
        }),
      }
    : null

  const bookCreatorGroup: ISidebarItem | null = hasAccess(FeatureModule.BOOK_CREATOR, tenantId)
    ? {
        label: 'Criador de Livros',
        icon: BookOpen,
        isCollapsible: true,
        children: [
          {
            label: 'Meus Livros',
            href: '/dashboard/books',
            icon: BookOpen,
          },
        ],
      }
    : null

  const menuItems: ISidebarItem[] = [
    adminGroup,
    financeGroup,
    crmGroup,
    erpGroup,
    pdvGroup,
    bookCreatorGroup,
  ].filter((item): item is ISidebarItem => item !== null)

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return {
    menuItems,
    isActive,
  }
}
