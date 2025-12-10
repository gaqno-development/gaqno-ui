import { UserRole, FeatureModule, FeaturePermissionLevel } from '@repo/core/types/user'
import { LucideIcon } from 'lucide-react'

export interface ISidebarItem {
  label: string
  href?: string
  icon: LucideIcon
  roles?: UserRole[]
  featureRequired?: FeatureModule
  minPermissionLevel?: FeaturePermissionLevel
  children?: ISidebarItem[]
  isCollapsible?: boolean
}

export interface ISidebarProps {
  isOpen: boolean
}

