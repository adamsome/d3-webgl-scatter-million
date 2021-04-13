import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import { isBrowser } from '../util/dom'
import { useTheme } from '../util/use-theme'

const Scatterplot = dynamic(() => import('../components/chart'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

type Props = typeof defaultProps

const defaultProps = {
  animate: true,
}

export default function Home(_: Props) {
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
        <title>D3 WebGL Scatterplot</title>

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

      <Header />

      <main className="w-screen h-screen pt-24">
        <Scatterplot />
      </main>
    </div>
  )
}

Home.defaultProps = defaultProps
