import * as d3 from 'd3'
import * as fc from 'd3fc'

async function scatterplot(container: HTMLDivElement) {
  const data = fc.randomFinancial()(50)

  const yExtent = fc
    .extentLinear()
    .accessors([(d: any) => d.high, (d: any) => d.low])

  const xExtent = fc.extentDate().accessors([(d: any) => d.date])

  const gridlines = fc.annotationSvgGridline()
  const candlestick = fc.seriesSvgCandlestick()
  const multi = fc
    .seriesSvgMulti()
    .series([gridlines, candlestick])
    .mapping((d: any) => d.data)

  const chart = fc
    .chartCartesian(d3.scaleTime(), d3.scaleLinear())
    .yDomain(yExtent(data))
    .xDomain(xExtent(data))
    .svgPlotArea(multi)

  d3.select(container).datum({ data }).call(chart)
}

export default scatterplot
