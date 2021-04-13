import React from 'react'
import { CHROMA_NAMES } from '../lib/hexbin-color'

type Props = typeof defaultProps & {
  value?: string
  onChange?: (selected: string) => void
}

const defaultProps = {}

export default function ChromaSelect({ value, onChange }: Props) {
  return (
    <div className="flex-start flex-col ml-6">
      <label className="text-xs text-gray-500 mb-0.5">Chromatic Scale</label>
      <select
        className="w-36 h-6 border border-gray-400 dark:border-transparent dark:bg-gray-700 rounded"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {CHROMA_NAMES.map((name) => (
          <option key={name} value={name}>
            {name.replace('Default', '')}
          </option>
        ))}
      </select>
    </div>
  )
}

ChromaSelect.defaultProps = defaultProps
