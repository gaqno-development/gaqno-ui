'use client'
import { useMemo } from 'react'
import { createClient } from '../utils/supabase/client'

export const useSupabaseClient = () => {
  return useMemo(() => createClient(), [])
}


