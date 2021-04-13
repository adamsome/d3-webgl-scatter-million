import React, { useEffect, useRef } from 'react'
import scatterplot from '../lib/scatterplot'
import { SvgAnnotation } from '../lib/svg-annotation'
import { useTheme } from '../util/use-theme'

type Props = typeof defaultProps

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

export default function Chart(_: Props) {
  const { theme } = useTheme()
  const chartRef = useRef<HTMLDivElement>(null)
  const tsvRef = useRef<Worker>()

  useEffect(() => {
    const { add } = scatterplot(chartRef.current, {
      annotate,
      defaultColor: theme === 'dark' ? '#777' : '#777',
    })

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
      }

      add(data, { done })
      i++
    }

    tsvRef.current.postMessage(DATA_URL)

    return () => {
      tsvRef.current.terminate()
    }
  }, [theme])

  return <div ref={chartRef} className="w-full h-full"></div>
}

Chart.defaultProps = defaultProps
