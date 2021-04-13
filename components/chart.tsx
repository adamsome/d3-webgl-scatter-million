import React, { useEffect, useRef, useState } from 'react'
import createScatterplot, { Scatterplot } from '../lib/scatterplot'
import { SvgAnnotation } from '../lib/svg-annotation'
import Loading from './loading'

type Props = typeof defaultProps & {
  hexRadius: number
  chroma: string
}

interface BookResponseDatum {
  title?: string
  first_author_name?: string
  language?: string
  date?: string
  x: string
  y: string
}

interface BookDatum extends Omit<BookResponseDatum, 'x' | 'y' | 'date'> {
  x: number
  y: number
  date: number
}

const defaultProps = {}

const DATA_URL =
  'https://raw.githubusercontent.com/ColinEberhardt/d3fc-webgl-hathi-explorer/master/data.tsv'

function parseDatum(d: BookResponseDatum): BookDatum {
  return {
    ...d,
    x: Number(d.x),
    y: Number(d.y),
    date: Number(d.date),
  }
}

function annotate(d: BookDatum): SvgAnnotation {
  let title = d.title ?? ''
  if (title.length > 50) title = title.substr(0, 50) + '...'

  let label = `${d.first_author_name ?? 'Unknown'} \n${d.date}`
  if (d.language) label += ` \n(${d.language})`

  const note = { title, label, wrapSplitter: /\n/, bgPadding: 3 }
  return { note, x: d.x, y: d.y, dx: 20, dy: 20 }
}

export default function Chart({ hexRadius, chroma }: Props) {
  const chartRef = useRef<Scatterplot>(null)
  const domRef = useRef<HTMLDivElement>(null)
  const tsvRef = useRef<Worker>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chartRef.current = createScatterplot(domRef.current).annotate(annotate)

    tsvRef.current = new Worker(
      new URL('../lib/tsv.worker.ts', import.meta.url)
    )

    let i = 0
    let lastBytes = 0
    tsvRef.current.onmessage = (event) => {
      const { data: rawData, done, bytes } = event.data
      const data = rawData.map(parseDatum).filter((d: any) => d.date)

      if (bytes - lastBytes > 1e7) {
        // eslint-disable-next-line no-console
        console.log('tsv-fetch', i, bytes, data[0])
        lastBytes = bytes
      }
      if (done) {
        // eslint-disable-next-line no-console
        console.log('tsv-done', bytes)
        setLoading(false)
      }

      chartRef.current(data, { done })
      i++
    }

    setLoading(true)
    tsvRef.current.postMessage(DATA_URL)

    return () => {
      tsvRef.current.terminate()
    }
  }, [])

  useEffect(() => {
    chartRef.current.hexRadius(hexRadius)
  }, [hexRadius])

  useEffect(() => {
    chartRef.current.chroma(chroma)
  }, [chroma])

  return (
    <div className="relative w-full h-full">
      <div ref={domRef} className="relative w-full h-full"></div>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
          <Loading />
        </div>
      )}
    </div>
  )
}

Chart.defaultProps = defaultProps
