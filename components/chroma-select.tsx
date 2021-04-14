import React from 'react'
import { CHROMA_GROUPS } from '../lib/chroma'

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
        className="w-48 h-7 border-0 border-transparent bg-gray-300 dark:bg-gray-800 rounded-lg"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {CHROMA_GROUPS.map((group) => (
          <optgroup key={group.name} label={group.name}>
            {group.items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

ChromaSelect.defaultProps = defaultProps
