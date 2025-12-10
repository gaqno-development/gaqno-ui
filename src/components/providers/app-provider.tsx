'use client'

import { AppProvider as AppStateProvider } from '@gaqno-dev/core/hooks';
import { ReactNode } from 'react'

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppStateProvider>
      {children}
    </AppStateProvider>
  )
}

