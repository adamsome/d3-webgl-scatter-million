import { hexbin } from 'd3-hexbin'
import { quadtree } from 'd3-quadtree'
import { scaleLog, scaleSequential } from 'd3-scale'
import * as scaleChromatic from 'd3-scale-chromatic'
import * as fc from 'd3fc'
import { Datum } from './datum'
import color from './webgl'

interface Hex {
  x: number
  y: number
  n: number
}

const xAccessor = <T extends Datum>(d: T) => d.x
const yAccessor = <T extends Datum>(d: T) => d.y

function getChromaScale(name: string): (v: number) => string {
  const chroma = scaleChromatic[`interpolate${name}`]
  if (!chroma) throw TypeError(`No chromatic scale with name '${name}'.`)
  return chroma
}

export default async function HexbinColor<T extends Datum>(
  data: T[],
  chromaName = 'CubehelixDefault',
  radius = 1
) {
  const { max, hexes } = hexbin<T>()
    .x(xAccessor)
    .y(yAccessor)
    .radius(radius)(data)
    .reduce(
      (acc, hex) => {
        const n = hex.length
        if (n > acc.max) acc.max = n
        acc.hexes.push({ x: hex.x, y: hex.y, n: n })
        return acc
      },
      { max: 0, hexes: [] } as { max: number; hexes: Hex[] }
    )

  const hextree = quadtree<Hex>().x(xAccessor).y(yAccessor).addAll(hexes)
  const scale = scaleLog().domain([1, max])
  const chroma = scaleSequential((d) => getChromaScale(chromaName)(d))

  const magnitudeColor = (n: number) => color(chroma(scale(n)))
  const hexColor = (d: T) => magnitudeColor(hextree.find(d.x, d.y)?.n ?? 0)
  return fc.webglFillColor().value(hexColor).data(data)
}
