import { range } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { event as d3Event, select } from 'd3-selection'
import { zoom as d3Zoom } from 'd3-zoom'
import * as fc from 'd3fc'
import { Datum } from './datum'
import {
  createPercentsByQuadrant,
  decoratePercentsByQuadrant,
} from './quadrant'
import color from './webgl'

export interface ScatterMillionOptions {
  defaultColor?: string
}

function randomDatum(): Datum {
  return { x: Math.random() * 50, y: Math.random() }
}

function scatterplot(
  container: HTMLDivElement,
  options: ScatterMillionOptions = {}
) {
  const { defaultColor = '#565a5e' } = options

  const data: Datum[] = range(50).map(randomDatum)

  const xScale = scaleLinear().domain([0, 50])
  const yScale = scaleLinear().domain([0, 1])
  const xScaleOriginal = xScale.copy()
  const yScaleOriginal = yScale.copy()

  const percents = createPercentsByQuadrant(data)

  const zoom = d3Zoom()
    .scaleExtent([0.1, 20])
    .on('zoom', () => {
      xScale.domain(d3Event.transform.rescaleX(xScaleOriginal).domain())
      yScale.domain(d3Event.transform.rescaleY(yScaleOriginal).domain())
      render()
    })

  const colorDefault = fc
    .webglFillColor()
    .value(() => color(defaultColor))
    .data(data)

  const pointSeries = fc
    .seriesWebglPoint()
    .equals((a: Datum[], b: Datum[]) => a === b)
    .size(5)
    .crossValue((d: Datum) => d.x)
    .mainValue((d: Datum) => d.y)
    .decorate(colorDefault)

  const gridlines = fc.annotationSvgGridline().xScale(xScale).yScale(yScale)

  const xOriginLine = fc
    .annotationSvgLine()
    .orient('vertical')
    .decorate(decoratePercentsByQuadrant(percents, xScale, yScale))

  const yOriginLine = fc.annotationSvgLine()

  const multiLines = fc
    .seriesSvgMulti()
    .series([gridlines, xOriginLine, yOriginLine])
    .mapping((_d: Datum[], i: number, series: any[]) => {
      switch (series[i]) {
        default:
          return [0]
      }
    })

  const chart = fc
    .chartCartesian(xScale, yScale)
    .yOrient('left')
    .webglPlotArea(pointSeries)
    .svgPlotArea(multiLines)
    .decorate((sel: any) =>
      sel
        .enter()
        .select('d3fc-svg.plot-area')
        .on('measure.range', () => {
          xScaleOriginal.range([0, d3Event.detail.width])
          yScaleOriginal.range([d3Event.detail.height, 0])
        })
        .call(zoom)
    )

  const render = () => {
    select(container).datum(data).call(chart)
  }

  render()
}

export default scatterplot
