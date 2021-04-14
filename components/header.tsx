import dynamic from 'next/dynamic'
import React from 'react'
import Count from './count'
import Logo from './logo'
import Slider from './slider'
import ThemeSwitch from './theme-switch'

type Props = typeof defaultProps & {
  count: number
  hexRadius: number
  chroma: string
  onHexRadiusChange?: (value: number) => void
  onChromaChange?: (value: string) => void
}

const defaultProps = {}

const ChromaSelect = dynamic(() => import('../components/chroma-select'), {
  ssr: false,
})

export default function Header({
  count,
  hexRadius,
  chroma,
  onHexRadiusChange,
  onChromaChange,
}: Props) {
  return (
    <nav className="fixed z-20 flex-center w-full h-24 py-2 px-6 bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-60 border-b dark:border-gray-900 transition-colors">
      <div className="mr-2 sm:mr-4 cursor-pointer group">
        <Logo
          body="text-black dark:text-white group-hover:text-blue-950 dark:group-hover:text-blue-200 transition-colors"
          line="text-black dark:text-white group-hover:text-blue-400 transition-colors"
          inner="text-white dark:text-black group-hover:text-red-600 transition-colors"
          big
        />
      </div>

      <div className="relative -top-1 text-gray-300 dark:text-gray-700 font-extralight italic text-5xl ml-1 mr-1">
        /
      </div>

      <div className="flex-1 text-4xl font-extralight ml-6 overflow-hidden overflow-ellipsis whitespace-nowrap">
        <Count count={count} /> data points
      </div>

      <Slider value={hexRadius} onChange={onHexRadiusChange} />
      <ChromaSelect value={chroma} onChange={onChromaChange} />
      <ThemeSwitch />
    </nav>
  )
}

Header.defaultProps = defaultProps
