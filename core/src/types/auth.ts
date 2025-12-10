import { User, Session } from '@supabase/supabase-js'
import { IUserProfile } from './user'

export interface IAuthContext {
  user: User | null
  session: Session | null
  profile: IUserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IRegisterCredentials {
  email: string
  password: string
  name: string
}

