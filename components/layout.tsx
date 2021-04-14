import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { isBrowser } from '../util/dom'
import { useTheme } from '../util/use-theme'

type Props = typeof defaultProps & {
  children: React.ReactNode
}

const defaultProps = {
  title: 'D3 WebGL Scatterplot',
}

export default function Layout({ children, title }: Props) {
  const { theme: rawTheme } = useTheme()
  const [theme, setTheme] = useState('dark')

  // Prevent style mismatch when SSR by waiting for client-side
  useEffect(() => {
    if (isBrowser) {
      setTheme(rawTheme ?? 'dark')
    }
  }, [isBrowser, rawTheme])

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Head>
        <meta charSet="utf-8" />
        <title>{title} / adamsome</title>

        <link
          rel="icon"
          href={theme === 'dark' ? '/favicon-invert.ico' : '/favicon.ico'}
        />
        <link
          rel="icon"
          href={theme === 'dark' ? '/icon-invert.svg' : '/icon.svg'}
          type="image/svg+xml"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Head>

      {children}
    </div>
  )
}

Layout.defaultProps = defaultProps
