import { UserRole } from '../types/user'

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/dashboard/admin',
  MANAGER: '/dashboard/manager',
  USER: '/dashboard/user',
  UNAUTHORIZED: '/unauthorized',
} as const

export const ROLE_ROUTES: Record<UserRole, string> = {
  [UserRole.ADMIN]: ROUTES.ADMIN,
  [UserRole.MANAGER]: ROUTES.MANAGER,
  [UserRole.USER]: ROUTES.USER,
}

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER]

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.ADMIN,
  ROUTES.MANAGER,
  ROUTES.USER,
]

