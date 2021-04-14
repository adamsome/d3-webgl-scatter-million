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
    <nav className="fixed z-20 flex-start flex-col w-full px-3 lg:px-6 bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-80 lg:dark:bg-opacity-60 border-b dark:border-gray-900 transition-colors">
      <div className="flex-center w-full h-12 lg:h-24 pt-2 lg:pb-2">
        <div className="hidden lg:block mr-2 lg:mr-4 cursor-pointer group">
          <Logo
            body="text-black dark:text-white group-hover:text-blue-950 dark:group-hover:text-blue-200 transition-colors"
            line="text-black dark:text-white group-hover:text-blue-400 transition-colors"
            inner="text-white dark:text-black group-hover:text-red-600 transition-colors"
            big
          />
        </div>

        <div className="block lg:hidden mr-2 lg:mr-4 cursor-pointer group">
          <Logo
            body="text-black dark:text-white group-hover:text-blue-950 dark:group-hover:text-blue-200 transition-colors"
            line="text-black dark:text-white group-hover:text-blue-400 transition-colors"
            inner="text-white dark:text-black group-hover:text-red-600 transition-colors"
          />
        </div>

        <div className="relative -top-1 text-4xl lg:text-5xl text-gray-300 dark:text-gray-700 font-extralight italic ml-1 mr-1">
          /
        </div>

        <div className="flex-1 text-2xl lg:text-4xl font-extralight ml-4 lg:ml-6 overflow-hidden overflow-ellipsis whitespace-nowrap">
          <Count count={count} /> data points
        </div>

        <Slider
          value={hexRadius}
          className="hidden lg:flex flex-col ml-6"
          onChange={onHexRadiusChange}
        />
        <ChromaSelect
          value={chroma}
          className="hidden lg:flex flex-col ml-6"
          onChange={onChromaChange}
        />
        <ThemeSwitch className="hidden sm:flex flex-col ml-6" />
      </div>

      <div className="flex-start w-full lg:hidden pb-3 overflow-y-auto">
        <ThemeSwitch className="sm:hidden flex flex-col ml-1" />
        <ChromaSelect
          value={chroma}
          className="flex flex-col ml-3 sm:ml-1"
          onChange={onChromaChange}
        />
        <Slider
          value={hexRadius}
          className="flex flex-col ml-3"
          onChange={onHexRadiusChange}
        />
      </div>
    </nav>
  )
}

Header.defaultProps = defaultProps
