import { useWhiteLabelStore } from '../store/whiteLabelStore'
import { useAuth } from './useAuth'
import { useSupabaseClient } from './useSupabaseClient'
import { IWhiteLabelConfig } from '../types/whitelabel'

export const useWhiteLabel = () => {
  const config = useWhiteLabelStore((state) => state.config)
  const setConfig = useWhiteLabelStore((state) => state.setConfig)
  const setLoading = useWhiteLabelStore((state) => state.setLoading)
  const setError = useWhiteLabelStore((state) => state.setError)
  const supabase = useSupabaseClient()
  const { session } = useAuth()

  const fetchWhiteLabelConfig = async (domain: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('white_label_configs')
        .select('*')
        .eq('domain', domain)
        .single()

      if (error) throw error

      setConfig(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return {
    config,
    fetchWhiteLabelConfig,
  }
}
