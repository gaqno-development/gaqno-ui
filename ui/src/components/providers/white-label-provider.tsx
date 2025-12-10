'use client'

import React, { useEffect } from 'react'
import { useWhiteLabel } from '@gaqno-dev/core/hooks';
import { applyWhiteLabelStyles } from '@gaqno-dev/core/utils'

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

