import { useUIStore } from '@gaqno-dev/core/store/uiStore'

export const useDashboardLayout = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const onOpenChange = (open: boolean) => {
    setSidebarOpen(open)
  }

  return {
    open: sidebarOpen,
    defaultOpen: sidebarOpen,
    onOpenChange,
  }
}

