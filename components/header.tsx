import { useEffect, useState } from 'react'
import { isBrowser } from '../util/dom'
import { useTheme } from '../util/use-theme'
import Switch from './switch'

type Props = typeof defaultProps

const defaultProps = {}

export default function Header(_: Props) {
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
    <nav className="fixed flex-center w-full h-24 py-2 px-6 border-b dark:border-gray-900 transition-colors">
      <div className="flex-1"></div>
      <Switch
        className="ml-6 my-2"
        selected={selected}
        lhsIcon={sunIcon()}
        lhsDimBG="white"
        lhsDimFG="black"
        lhsLitBG="white"
        lhsLitFG="black"
        rhsIcon={moonIcon()}
        rhsDimBG="black"
        rhsDimFG="white"
        rhsLitBG="black"
        rhsLitFG="white"
        round={false}
        size={9}
        borderWidth={4}
        onToggle={() => toggleTheme()}
      />
    </nav>
  )
}

Header.defaultProps = defaultProps
