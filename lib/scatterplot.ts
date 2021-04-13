import { quadtree as d3_quadtree, Quadtree } from 'd3-quadtree'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import { event as d3_event, select } from 'd3-selection'
import { annotationCallout } from 'd3-svg-annotation'
import { zoom as d3_zoom } from 'd3-zoom'
import * as fc from 'd3fc'
import { Datum } from './datum'
import HexbinColor from './hexbin-color'
import {
  decoratePercentsByQuadrant,
  QuadrantPercents,
} from './quadrant-percents'
import svgAnnotation, {
  DataWithAnnotations,
  SvgAnnotation,
} from './svg-annotation'
import color from './webgl'

const RENDER_MS = 750
const SCALE_MS = 2000

export interface ScatterMillionOptions<T extends Datum> {
  initialData?: T[]
  defaultColor?: string
  annotate?: (d: T) => SvgAnnotation
  zoomScale?: [number, number]
}

export default function scatterplot<T extends Datum>(
  container: HTMLDivElement,
  options: ScatterMillionOptions<T> = {}
) {
  const {
    defaultColor = '#565a5e',
    initialData,
    annotate,
    zoomScale = [0.5, 40],
  } = options

  // const data: Datum[] = range(50).map(randomDatum)
  let data: T[] = []
  let quadtree: Quadtree<T>
  const annotations: SvgAnnotation[] = []

  let lastRender = 0
  let lastScale = 0

  // const extents = Extents({ padding: 25, include: [0] })
  const percents = QuadrantPercents()

  let xScale: ScaleLinear<number, number>
  let yScale: ScaleLinear<number, number>
  let xScaleOriginal: ScaleLinear<number, number>
  let yScaleOriginal: ScaleLinear<number, number>

  const xExtent = fc
    .extentLinear()
    .accessors([(d: T) => d.x])
    .include([0])

  const yExtent = fc
    .extentLinear()
    .accessors([(d: T) => d.y])
    .include([0])

  function updateScales() {
    if (data.length > 0) lastScale = Date.now()

    if (!xScale) xScale = scaleLinear()
    xScale.domain(xExtent(data))
    xScaleOriginal = xScale.copy()

    if (!yScale) yScale = scaleLinear()
    yScale.domain(yExtent(data))
    yScaleOriginal = yScale.copy()
  }

  updateScales()

  const pointSeries = fc
    .seriesWebglPoint()
    .equals((a: T[], b: T[]) => a === b)
    .size(1)
    .crossValue((d: T) => d.x)
    .mainValue((d: T) => d.y)
    .decorate((program: any, data: T[]) => {
      fc
        .webglFillColor()
        .value(() => color(defaultColor))
        .data(data)(program)
    })

  const multiPointSeries = fc
    .seriesWebglMulti()
    .series([pointSeries])
    .mapping((d: DataWithAnnotations<T>) => d.data)

  const calloutSeries = svgAnnotation().notePadding(15).type(annotationCallout)

  const gridlines = fc.annotationSvgGridline().xScale(xScale).yScale(yScale)

  const xOriginLine = fc
    .annotationSvgLine()
    .orient('vertical')
    .decorate((sel: any) => {
      decoratePercentsByQuadrant(percents, xScale, yScale, sel)
    })

  const yOriginLine = fc.annotationSvgLine()

  const multiLines = fc
    .seriesSvgMulti()
    .series([gridlines, xOriginLine, yOriginLine, calloutSeries])
    .mapping((d: DataWithAnnotations<T>, i: number, series: any[]) => {
      switch (series[i]) {
        case calloutSeries:
          return d.annotations
        default:
          return [0]
      }
    })

  const zoom = d3_zoom()
    .scaleExtent(zoomScale)
    .on('zoom', () => {
      xScale.domain(d3_event.transform.rescaleX(xScaleOriginal).domain())
      yScale.domain(d3_event.transform.rescaleY(yScaleOriginal).domain())
      render()
    })

  const pointer = fc.pointer().on('point', ([coord]: readonly [Datum]) => {
    handleMouseMove(coord)
  })

  const chart = fc
    .chartCartesian(xScale, yScale)
    .yOrient('left')
    .svgPlotArea(multiLines)
    .webglPlotArea(multiPointSeries)
    .decorate((sel: any) =>
      sel
        .enter()
        .select('d3fc-svg.plot-area')
        .on('measure.range', () => {
          xScaleOriginal.range([0, d3_event.detail.width])
          yScaleOriginal.range([d3_event.detail.height, 0])
        })
        .call(zoom)
        .call(pointer)
    )

  function handleMouseMove(coord?: Datum): void {
    annotations.pop()
    if (!coord || !quadtree || !annotate) return

    const x = xScale.invert(coord.x)
    const y = yScale.invert(coord.y)
    const r = Math.abs(x - xScale.invert(coord.x - 20))
    const d = quadtree.find(x, y, r)

    if (d) {
      const annotation = annotate(d)
      const dx = xScale(d.x)
      const xmax = xScale.range()[1]
      if (dx > xmax - 400) annotation.dx = -annotation.dx

      const dy = yScale(d.y)
      const ymax = yScale.range()[0]
      if (dy > ymax - 400) annotation.dy = -annotation.dy

      annotations[0] = annotation
    }

    render()
  }

  function updateColors() {
    const chroma = 'CubehelixDefault'
    const radius = 0.15
    const hexbinColor = HexbinColor(data, chroma, radius)
    pointSeries.decorate(hexbinColor)
  }

  function render() {
    if (data.length > 0) lastRender = Date.now()

    select(container).datum({ data, annotations }).call(chart)
  }

  function add(newData: T[], { done }: { done?: boolean } = {}) {
    data = data.concat(newData)
    // extents.add(newData)
    // extents.reversePad(0.95, 0.95)

    const now = Date.now()

    if (done || now - lastScale > SCALE_MS) updateScales()

    if (done) {
      // extents.clear()
      percents.add(data)
      updateColors()

      quadtree = d3_quadtree<T>()
        .x((d) => d.x)
        .y((d) => d.y)
        .addAll(data)
    }

    if (done || now - lastRender > RENDER_MS) render()
  }

  if (initialData) add(initialData, { done: true })

  render()

  return { render, add }
}
