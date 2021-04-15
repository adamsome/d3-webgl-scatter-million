import React from 'react'
import FormLabel from './form-label'

type Props = typeof defaultProps & {
  value?: number
  onChange?: (value: number) => void
}

const defaultProps = {
  min: 0.01,
  max: 1,
  step: 0.05,
  className: '',
}

export default function Slider({
  value,
  min,
  max,
  step,
  className,
  onChange,
}: Props) {
  return (
    <div className={className}>
      <FormLabel>Hex Radius</FormLabel>
      <div className="h-7 rounded flex-center flex-col px-2 bg-white bg-opacity-75 dark:bg-black dark:bg-opacity-75">
        <input
          className="w-20 sm:w-24 bg-gray-300 dark:bg-gray-800 appearance-none h-0.5 rounded"
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
