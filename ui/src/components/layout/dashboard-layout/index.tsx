import React from 'react'
import { Header } from '../header'
import { AppSidebar } from '../app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '../../ui/sidebar'
import { useDashboardLayout } from './hooks/useDashboardLayout'
import { IDashboardLayoutProps } from './types'

export const DashboardLayout: React.FC<IDashboardLayoutProps> = ({ children }) => {
  const { open, defaultOpen, onOpenChange } = useDashboardLayout()

  return (
    <SidebarProvider open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header userProfile={null} />
          <main className="flex-1 p-4 sm:p-6 overflow-auto min-h-0">
            <div className="mx-auto w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

DashboardLayout.displayName = 'DashboardLayout'

