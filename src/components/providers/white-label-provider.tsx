'use client'

import React, { useEffect } from 'react'
import { useWhiteLabel } from '@repo/core/hooks';
import { applyWhiteLabelStyles } from '@repo/core/utils'

export const WhiteLabelProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { config } = useWhiteLabel()

  useEffect(() => {
    if (config) {
      applyWhiteLabelStyles(config)
    }
  }, [config])

  return <>{children}</>
}

