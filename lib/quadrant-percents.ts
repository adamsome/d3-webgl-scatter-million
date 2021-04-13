import { ScaleLinear } from 'd3-scale'
import { BaseType, Selection } from 'd3-selection'
import { Datum } from './datum'

interface QuadrantPercentValues {
  1: number
  2: number
  3: number
  4: number
}

const formatRound = (total: number) => (count: number): number => {
  return Math.round(((100 * count) / total) * 10) / 10
}

type IQuadrantPercents = ReturnType<typeof QuadrantPercents>

export function QuadrantPercents(data?: Datum[]) {
  let count = 0
  const quadrants = { 1: 0, 2: 0, 3: 0, 4: 0 }

  function addOne(d: Datum): void {
    count++
    if (d.y >= 0) {
      if (d.x >= 0) {
        quadrants[1]++
      } else {
        quadrants[2]++
      }
    } else {
      if (d.x >= 0) {
        quadrants[4]++
      } else {
        quadrants[3]++
      }
    }
  }

  function add(data: Datum | Datum[]): void {
    if (!Array.isArray(data)) return addOne(data)
    data.forEach(addOne)
  }

  if (data) data.forEach(add)

  function value(): QuadrantPercentValues {
    const round = formatRound(count)
    return {
      1: round(quadrants[1]),
      2: round(quadrants[2]),
      3: round(quadrants[3]),
      4: round(quadrants[4]),
    }
  }

  return { add, value, count: () => count }
}

export const decoratePercentsByQuadrant = (
  quadrantPercents: IQuadrantPercents,
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
  lineSelection: any
): void => {
  lineSelection = lineSelection.attr(
    'class',
    `${lineSelection.attr('class') ?? ''} origin`
  )
  lineSelection.selectAll('text').remove()
  lineSelection.selectAll('rect').remove()

  if (quadrantPercents.count() === 0) return

  const xEnd = xScale.range()[1]
  const xOrigin = xScale(0)
  const xOriginFromEnd = xEnd - xOrigin
  const xOriginBefore = Math.min(xOriginFromEnd - 30, -30)
  const xOriginEnd = Math.max(xOriginFromEnd - 30, 90)

  const [yStart, yEnd] = yScale.range()
  const yOrigin = yScale(0)
  const yOriginFromStart = yOrigin - yStart
  const yOriginFromEnd = yEnd + yOrigin
  const yOriginStart = Math.max(yOriginFromStart + 40, -24)
  const yOriginEnd = Math.min(yOriginFromEnd - 30, 41)

  const percents = quadrantPercents.value()

  const top = lineSelection.select('g.top-handle')
  renderQuadrantPercentText(top, 2, xOriginBefore, yOriginEnd, percents)
  renderQuadrantPercentText(top, 1, xOriginEnd, yOriginEnd, percents)

  const bottom = lineSelection.select('g.bottom-handle')
  renderQuadrantPercentText(bottom, 3, xOriginBefore, yOriginStart, percents)
  renderQuadrantPercentText(bottom, 4, xOriginEnd, yOriginStart, percents)
}

function renderQuadrantPercentText(
  handle: Selection<BaseType, readonly [number], SVGGElement, any>,
  quadrant: 1 | 2 | 3 | 4,
  x: number,
  y: number,
  percents: QuadrantPercentValues
): void {
  const rect = handle
    .append('rect')
    .classed(`quadrant quadrant-${quadrant}`, true)
    .attr('rx', 4)
    .attr('ry', 4)

  const box = handle
    .append('text')
    .classed(`quadrant quadrant-${quadrant}`, true)
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'end')
    .text(`${percents[quadrant]}%`)
    .node()
    .getBBox()

  rect
    .attr('x', x - box.width - 5)
    .attr('y', y - box.height + 5)
    .attr('width', box.width + 10)
    .attr('height', box.height)
}
