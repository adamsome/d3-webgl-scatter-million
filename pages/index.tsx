import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import Loading from '../components/loading'
import { CHROMA_DEFAULT, HEX_RADIUS_DEFAULT } from '../lib/consts'
import { isBrowser } from '../util/dom'
import { useTheme } from '../util/use-theme'

const Chart = dynamic(() => import('../components/chart'), {
  ssr: false,
  loading: () => <Loading />,
})

type Props = typeof defaultProps

const defaultProps = {
  animate: true,
}

export default function Home(_: Props) {
  const { theme: rawTheme } = useTheme()
  const [theme, setTheme] = useState('dark')
  const [hexRadius, setHexRadius] = useState(HEX_RADIUS_DEFAULT)
  const [chroma, setChroma] = useState(CHROMA_DEFAULT)

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

      <Header
        hexRadius={hexRadius}
        chroma={chroma}
        onHexRadiusChange={setHexRadius}
        onChromaChange={setChroma}
      />

      <main className="w-screen h-screen pt-24">
        {/* <Loading /> */}
        <Chart hexRadius={hexRadius} chroma={chroma} />
      </main>
    </div>
  )
}

Home.defaultProps = defaultProps
