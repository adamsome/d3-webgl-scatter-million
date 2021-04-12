import React, { useEffect, useRef } from 'react'
import scatterplot from '../lib/scatterplot'

type Props = typeof defaultProps

const defaultProps = {}

export default function Chart(_: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) scatterplot(ref.current)
  }, [ref])

  return (
    <div ref={ref} className="w-full h-full bg-gray-200 dark:bg-white"></div>
  )
}

Chart.defaultProps = defaultProps
