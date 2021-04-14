import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import Header from '../components/header'
import Layout from '../components/layout'
import Loading from '../components/loading'
import { CHROMA_DEFAULT, HEX_RADIUS_DEFAULT } from '../lib/consts'

const Chart = dynamic(() => import('../components/chart'), {
  ssr: false,
  loading: () => <Loading />,
})

type Props = typeof defaultProps

const defaultProps = {
  animate: true,
}

export default function Home(_: Props) {
  const [count, setCount] = useState(0)
  const [hexRadius, setHexRadius] = useState(HEX_RADIUS_DEFAULT)
  const [chroma, setChroma] = useState(CHROMA_DEFAULT)

  return (
    <Layout title="D3 WebGL Scatterplot">
      <Header
        count={count}
        hexRadius={hexRadius}
        chroma={chroma}
        onHexRadiusChange={setHexRadius}
        onChromaChange={setChroma}
      />

      <main className="w-screen h-screen">
        {/* <Loading /> */}
        <Chart hexRadius={hexRadius} chroma={chroma} onCountChange={setCount} />
      </main>
    </Layout>
  )
}

Home.defaultProps = defaultProps
