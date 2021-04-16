import { quadtree as d3_quadtree, Quadtree } from 'd3-quadtree'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import { event as d3_event, select } from 'd3-selection'
import { annotationCallout } from 'd3-svg-annotation'
import { zoom as d3_zoom, ZoomBehavior } from 'd3-zoom'
import * as fc from 'd3fc'
import {
  CHROMA_DARK_DEFAULT,
  HEX_RADIUS_DEFAULT,
  ZOOM_SCALE_DEFAULT,
} from './consts'
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

export type Scatterplot = ReturnType<typeof createScatterplot>

export default function createScatterplot<T extends Datum>(
  container: HTMLDivElement
) {
  let data: T[] = []

  // Lookup points by coord position for annotations
  let quadtree: Quadtree<T>
  const annotations: SvgAnnotation[] = []

  // Calculate percent of points in each quadrant
  const percents = QuadrantPercents()
  // const extents = Extents({ padding: 25, include: [0] })

  // Timestamp trackers
  let lastRender = 0
  let lastScale = 0

  // Option defaults
  let hexRadius = HEX_RADIUS_DEFAULT
  let chroma = CHROMA_DARK_DEFAULT
  let annotate: ((d: T) => SvgAnnotation) | undefined
  let defaultColor = '#565a5e'
  let zoomScale = ZOOM_SCALE_DEFAULT

  // Chart scaling
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

  // Setup chart

  // Individual data points rendered by webgl
  const pointSeries = fc
    .seriesWebglPoint()
    .equals((a: T[], b: T[]) => a === b)
    .size(1)
    .crossValue((d: T) => d.x)
    .mainValue((d: T) => d.y)
    // Give points a default color until the hex colors are applied
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

  // Setup annotations on hover
  const calloutSeries = svgAnnotation().notePadding(15).type(annotationCallout)

  const pointer = fc.pointer().on('point', ([coord]: readonly [Datum]) => {
    handleMouseMove(coord)
  })

  // Subtle vertical & horizontal lines at the axis tick marks
  const gridlines = fc.annotationSvgGridline().xScale(xScale).yScale(yScale)

  // Vertical line at the x-origin, but also renders the quadrant percents
  const xOriginLine = fc
    .annotationSvgLine()
    .orient('vertical')
    .decorate((sel: any) => {
      decoratePercentsByQuadrant(percents, xScale, yScale, sel)
    })

  // Simple horizontal line at the y-origin
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

  // Setup chart zoom on mousewheel & pan on drag handling
  let zoom: ZoomBehavior<Element, unknown>

  const updateZoom = () => {
    zoom = d3_zoom()
      .scaleExtent(zoomScale)
      .on('zoom', () => {
        xScale.domain(d3_event.transform.rescaleX(xScaleOriginal).domain())
        yScale.domain(d3_event.transform.rescaleY(yScaleOriginal).domain())
        render()
      })
  }

  updateZoom()

  // Setup all chart elements
  const chart = fc
    .chartCartesian(xScale, yScale)
    .yOrient('left')
    .yAxisWidth('2.5em')
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

  // Handle showing the annotation of the closest data point on hover
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

  // Uses hexbin to increase color intensity where data is denser
  async function updateColors() {
    if (data.length === 0) return

    const hexbinColor = await HexbinColor(data, chroma, hexRadius)
    pointSeries.decorate(hexbinColor)
  }

  // Draw the chart to the DOM
  function render() {
    if (data.length > 0) lastRender = Date.now()

    select(container).datum({ data, annotations }).call(chart)
  }

  async function addData(
    newData: T[],
    { done }: { done?: boolean } = {}
  ): Promise<number> {
    data = data.concat(newData)
    // extents.add(newData)
    // extents.reversePad(0.95, 0.95)

    // Update scales on a throttled basis as data comes in
    const now = Date.now()
    if (done || now - lastScale > SCALE_MS) updateScales()

    if (done) {
      // Apply density chroma scheme & show percents now that all data is loaded
      // extents.clear()
      percents.add(data)
      await updateColors()

      quadtree = d3_quadtree<T>()
        .x((d) => d.x)
        .y((d) => d.y)
        .addAll(data)
    }

    if (done || now - lastRender > RENDER_MS) render()

    return data.length
  }

  addData.hexRadius = async (value: number) => {
    hexRadius = value
    await updateColors()
    render()
    return addData
  }

  addData.chroma = async (value: string) => {
    chroma = value
    await updateColors()
    render()
    return addData
  }

  addData.zoomScale = (value: [number, number]) => {
    zoomScale = value
    updateZoom()
    return addData
  }

  addData.defaultColor = (value: string) => {
    defaultColor = value
    return addData
  }

  addData.annotate = (value: (d: T) => SvgAnnotation) => {
    annotate = value
    return addData
  }

  addData.count = () => data.length

  addData.render = render

  render()

  return addData
}
