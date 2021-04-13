import { Numeric } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import { annotation as d3_annotation } from 'd3-svg-annotation'
import * as fc from 'd3fc'
import { Datum } from './datum'

export interface SvgAnnotation {
  note: {
    label: string
    bgPadding: number
    title: string
    wrapSplitter?: RegExp
  }
  x: string | number | Numeric
  y: string | number | Numeric
  dx: number
  dy: number
  subject?: {
    radius?: number
    radiusPadding?: number
  }
}

export interface DataWithAnnotations<T> {
  data: T[]
  annotations: SvgAnnotation[]
}

export default function svgAnnotation<T extends Datum>(): any {
  let xScale = scaleLinear()
  let yScale = scaleLinear()
  const join = fc.dataJoin('g', 'annotation')
  const annotation = d3_annotation()

  const _annotation = (sel: any) => {
    sel.each((data: T[], i: number, group: any) => {
      const scaledData = data.map((d) => ({
        ...d,
        x: xScale(d.x),
        y: yScale(d.y),
      }))

      annotation.annotations(scaledData)

      join(select(group[i]), scaledData).call(annotation)
    })
  }

  _annotation.xScale = (...args: any[]) => {
    if (args.length === 0) return xScale
    xScale = args[0]
    return _annotation
  }

  _annotation.yScale = (...args: any[]) => {
    if (args.length === 0) return yScale
    yScale = args[0]
    return _annotation
  }

  fc.rebindAll(_annotation, annotation)

  return _annotation
}
