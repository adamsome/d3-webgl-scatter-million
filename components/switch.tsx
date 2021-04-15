import React from 'react'

type Props = typeof defaultProps & {
  selected: 'left' | 'right'
  lhsIcon: React.ReactNode
  rhsIcon: React.ReactNode
  className?: string
  onToggle?: () => void
}

const defaultProps = {
  iconSize: 'w-7 h-7',
  lhsDimBG: 'bg-white border-white focus:visible:ring-white',
  lhsDimFG: 'text-gray-400',
  lhsLitBG: 'bg-yellow-300 border-yellow-300 focus:visible:ring-yellow-300',
  lhsLitFG: 'text-yellow-800',
  rhsDimBG: 'bg-black border-black focus:visible:ring-black',
  rhsDimFG: 'text-gray-600',
  rhsLitBG: 'bg-blue-700 border-blue-700 focus:visible:ring-blue-700',
  rhsLitFG: 'text-blue-200',
  borderWidth: 'border-2',
  invertBorder: false,
  round: true,
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
  iconSize,
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

  const buttonClasses = [
    'flex',
    'relative',
    'group',
    bg,
    borderWidth,
    round ? 'rounded-lg' : '',
    'focus:outline-none',
    'focus:ring-0',
    'focus-visible:ring-4',
    'focus-visible:ring-opacity-30',
    'transition-colors',
    className,
  ]

  const rounded = round ? 'rounded-md' : ''
  const outerClass = `flex justify-center items-center ${rounded} border-0 transition-colors`
  const innerClass = `${iconSize} border-0 transform -skew-x-12 transition-colors`
  const iconClass =
    'absolute flex justify-center items-center transition-colors w-2/4 h-full'

  return (
    <button className={buttonClasses.join(' ')} onClick={() => onToggle?.()}>
      <div className={`${lhsBG} ${outerClass} pl-3`}>
        <div className={`${lhsBG} ${innerClass}`}></div>
        <div className={`${lhsFG} ${iconClass} left-0`}>{lhsIcon}</div>
      </div>

      <div className={`${rhsBG} ${outerClass} pr-3`}>
        <div className={`${rhsBG} ${innerClass}`}></div>
        <div className={`${rhsFG} ${iconClass} right-0`}>{rhsIcon}</div>
      </div>
    </button>
  )
}

Switch.defaultProps = defaultProps
