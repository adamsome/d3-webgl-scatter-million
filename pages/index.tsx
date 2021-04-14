import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import Layout from '../components/layout'
import Loading from '../components/loading'
import {
  CHROMA_DARK_DEFAULT,
  CHROMA_DARK_KEY,
  CHROMA_LIGHT_DEFAULT,
  CHROMA_LIGHT_KEY,
  HEX_RADIUS_DEFAULT,
  HEX_RADIUS_KEY,
} from '../lib/consts'
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
  const { theme } = useTheme()
  const [count, setCount] = useState(0)
  const [hexRadius, setHexRadius] = useState(HEX_RADIUS_DEFAULT)
  const [chroma, setChroma] = useState(CHROMA_DARK_DEFAULT)

  useEffect(() => {
    if (isBrowser) {
      const key = theme === 'light' ? CHROMA_LIGHT_KEY : CHROMA_DARK_KEY
      const storedChroma = localStorage[key]
      if (storedChroma) {
        // Restore from local storage
        setChroma(storedChroma)
      } else {
        // Nothing in local storage, set theme's default
        const defaultChroma =
          theme === 'light' ? CHROMA_LIGHT_DEFAULT : CHROMA_DARK_DEFAULT
        setChroma(defaultChroma)
      }
    }
  }, [isBrowser, theme])

  const handleChromaChange = (value: string) => {
    setChroma(value)

    const key = theme === 'light' ? CHROMA_LIGHT_KEY : CHROMA_DARK_KEY
    localStorage[key] = value
  }

  const handleHexRadiusChange = (value: number) => {
    setHexRadius(value)

    localStorage[HEX_RADIUS_KEY] = value
  }

  return (
    <Layout title="D3 WebGL Scatterplot">
      <Header
        count={count}
        hexRadius={hexRadius}
        chroma={chroma}
        onHexRadiusChange={handleHexRadiusChange}
        onChromaChange={handleChromaChange}
      />

      <main className="w-screen h-screen">
        <Chart hexRadius={hexRadius} chroma={chroma} onCountChange={setCount} />
      </main>
    </Layout>
  )
}

Home.defaultProps = defaultProps
