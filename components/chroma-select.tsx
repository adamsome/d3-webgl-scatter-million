import React from 'react'
import { CHROMA_GROUPS } from '../lib/chroma'
import FormLabel from './form-label'

type Props = typeof defaultProps & {
  value?: string
  onChange?: (selected: string) => void
}

const defaultProps = {
  className: '',
}

export default function ChromaSelect({ value, className, onChange }: Props) {
  return (
    <div className={className}>
      <FormLabel>Chromatic Scale</FormLabel>
      <select
        className="w-36 sm:w-48 h-7 border-0 border-transparent bg-gray-300 dark:bg-gray-800 rounded-lg"
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
