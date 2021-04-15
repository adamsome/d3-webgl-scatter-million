import { useEffect, useState } from 'react'
import { isBrowser } from '../util/dom'
import { useTheme } from '../util/use-theme'
import Switch from './switch'

type Props = typeof defaultProps

const defaultProps = {
  className: '',
}

export default function ThemeSwitch({ className }: Props) {
  const { theme: rawTheme, setTheme: setRawTheme } = useTheme()
  const [theme, setTheme] = useState('dark')

  // Prevent style mismatch when SSR by waiting for client-side
  useEffect(() => {
    if (isBrowser) setTheme(rawTheme ?? 'dark')
  }, [isBrowser, rawTheme])

  const selected = theme === 'dark' ? 'right' : 'left'

  const toggleTheme = () => setRawTheme(theme === 'dark' ? 'light' : 'dark')

  /*! Feather Icons v4.28.0 | MIT License | https://feathericons.com */
  const sunIcon = (size = '80%') => (
    <svg
      className={`stroke-current stroke-2 ${
        theme !== 'dark' ? 'fill-current' : ''
      }`}
      fill="transparent"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  )

  /*! Feather Icons v4.28.0 | MIT License | https://feathericons.com */
  const moonIcon = (size = '80%') => (
    <svg
      className={`stroke-current stroke-2 ${
        theme === 'dark' ? 'fill-current' : ''
      }`}
      fill="transparent"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  )

  return (
    <div className={className}>
      <label className="text-xs text-gray-500 mb-0.5">Theme</label>
      <div className="h-7 flex-center flex-col">
        <Switch
          selected={selected}
          lhsIcon={sunIcon()}
          lhsDimBG="bg-gray-800 border-gray-800 focus-visible:ring-gray-800"
          lhsDimFG="text-gray-500 group-hover:text-yellow-500"
          lhsLitBG="bg-white border-white focus-visible:ring-white"
          lhsLitFG="text-yellow-500"
          rhsIcon={moonIcon()}
          rhsDimBG="bg-gray-300 border-gray-300 focus-visible:ring-gray-300"
          rhsDimFG="text-gray-400 group-hover:text-blue-600"
          rhsLitBG="bg-black border-black focus-visible:ring-black"
          rhsLitFG="text-blue-600"
          iconSize="w-6 h-6"
          onToggle={() => toggleTheme()}
        />
      </div>
    </div>
  )
}

ThemeSwitch.defaultProps = defaultProps
