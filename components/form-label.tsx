import React from 'react'

type Props = typeof defaultProps & {
  children: React.ReactNode
}

const defaultProps = {}

export default function FormLabel({ children }: Props) {
  return (
    <label className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
      {children}
    </label>
  )
}

FormLabel.defaultProps = defaultProps
