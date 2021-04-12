import React from 'react'

type Props = typeof defaultProps & {
  selected: 'left' | 'right'
  lhsIcon: React.ReactNode
  rhsIcon: React.ReactNode
  className?: string
  onToggle?: () => void
}

const defaultProps = {
  animate: true,
  lhsDimBG: 'white',
  lhsDimFG: 'gray-400',
  lhsLitBG: 'yellow-300',
  lhsLitFG: 'yellow-800',
  rhsDimBG: 'black',
  rhsDimFG: 'gray-600',
  rhsLitBG: 'blue-700',
  rhsLitFG: 'blue-200',
  invertBorder: false,
  round: true,
  size: 7,
  borderWidth: 2,
}

export default function Switch({
  selected,
  lhsIcon,
  rhsIcon,
  className,
  lhsDimBG,
  lhsDimFG,
  lhsLitBG,
  lhsLitFG,
  rhsDimBG,
  rhsDimFG,
  rhsLitBG,
  rhsLitFG,
  invertBorder,
  round,
  size,
  borderWidth,
  onToggle,
}: Props) {
  const isLeft = selected === 'left'

  const lhsBG = !isLeft ? lhsDimBG : lhsLitBG
  const lhsFG = !isLeft ? lhsDimFG : lhsLitFG
  const rhsBG = isLeft ? rhsDimBG : rhsLitBG
  const rhsFG = isLeft ? rhsDimFG : rhsLitFG
  let bg: string
  if (!isLeft) {
    bg = !invertBorder ? lhsBG : rhsBG
  } else {
    bg = !invertBorder ? rhsBG : lhsBG
  }

  const sizeCx = `w-${size} h-${size}`
  const borderWidthCx = borderWidth === 1 ? 'border' : `border-${borderWidth}`

  return (
    <button
      className={`
        flex relative transition-colors group
        bg-${bg} ${borderWidthCx} border-${bg} ${round ? 'rounded-lg' : ''}
        focus:outline-none focus:ring-0
        focus-visible:ring-4 focus-visible:ring-${bg} focus-visible:ring-opacity-30
        ${className ?? ''}
      `}
      onClick={() => onToggle?.()}
    >
      <div
        className={`
          flex justify-center items-center
          bg-${lhsBG} ${round ? 'rounded-md' : ''} pl-3 transition-colors
        `}
      >
        <div
          className={`${sizeCx} bg-${lhsBG} transform -skew-x-12 transition-colors`}
        ></div>
        <div
          className={`
            absolute flex justify-center items-center transition-colors
            w-2/4 h-full left-0 text-${lhsFG} group-hover:text-${lhsLitFG}
          `}
        >
          {lhsIcon}
        </div>
      </div>
      <div
        className={`
          flex justify-center items-center
          bg-${rhsBG} ${round ? 'rounded-md' : ''} pr-3 transition-colors
        `}
      >
        <div
          className={`${sizeCx} bg-${rhsBG} transform -skew-x-12 transition-colors`}
        ></div>
        <div
          className={`
            absolute flex justify-center items-center transition-colors
            w-2/4 h-full right-0 text-${rhsFG} group-hover:text-${rhsLitFG}
          `}
        >
          {rhsIcon}
        </div>
      </div>
    </button>
  )
}

Switch.defaultProps = defaultProps
