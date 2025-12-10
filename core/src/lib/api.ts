import { IUser, IUserProfile, ICreateUserRequest, IUpdateUserRequest } from '../types/user'
import { createClient } from '../utils/supabase/client'

const supabase = createClient()

export const api = {
  users: {
    getAll: async (): Promise<IUserProfile[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    getById: async (id: string): Promise<IUserProfile> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },

    create: async (user: ICreateUserRequest): Promise<IUser> => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          name: user.name,
          role: user.role,
          department: user.department,
        } as any)

      if (profileError) throw profileError

      return authData.user as IUser
    },

    update: async (id: string, user: IUpdateUserRequest): Promise<IUserProfile> => {
      const { data, error } = await supabase
        .from('profiles')
        .update(user as any)
        .eq('user_id', id)
        .select()
        .single()

      if (error) throw error
      return data as IUserProfile
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', id)

      if (error) throw error
    },
  },
}
