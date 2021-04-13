import React from 'react'

type Props = typeof defaultProps & {
  value?: number
  onChange?: (value: number) => void
}

const defaultProps = {
  min: 0.01,
  max: 1,
  step: 0.05,
}

export default function Slider({ value, min, max, step, onChange }: Props) {
  return (
    <div className="flex-start flex-col ml-6">
      <label className="text-xs text-gray-500 mb-0.5">Hex Radius</label>
      <div className="h-6 dark:bg-gray-700 rounded pt-0.5 px-2">
        <input
          className="w-32"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
        ></input>
      </div>
    </div>
  )
}

Slider.defaultProps = defaultProps
