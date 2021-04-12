import React, { useEffect, useRef } from 'react'
import scatterplot from '../lib/scatterplot'
import { useTheme } from '../util/use-theme'

type Props = typeof defaultProps

const defaultProps = {}

export default function Chart(_: Props) {
  const { theme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current)
      scatterplot(ref.current, {
        defaultColor: theme === 'dark' ? '#777' : '#777',
      })
  }, [ref, theme])

  return <div ref={ref} className="w-full h-full"></div>
}

Chart.defaultProps = defaultProps
