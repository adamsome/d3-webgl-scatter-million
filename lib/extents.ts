import { Datum } from './datum'

interface Rect {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ExtentsOptions {
  padding?: Rect | number
  include?: number[]
}

function parsePadding(options: ExtentsOptions = {}): Rect {
  const p = options.padding ?? 0
  if (typeof p === 'number') return { top: p, bottom: p, left: p, right: p }
  return p
}

export default function Extents(options: ExtentsOptions = {}) {
  let xs: number[] = []
  let ys: number[] = []
  let xmin = Number.MAX_VALUE
  let xmax = 0
  let ymin = Number.MAX_VALUE
  let ymax = 0

  const padding = parsePadding(options)

  function addOne(d: Datum): void {
    xs.push(d.x)
    ys.push(d.y)

    if (d.x < xmin) xmin = d.x
    if (d.x > xmax) xmax = d.x
    if (d.y < ymin) ymin = d.y
    if (d.y > ymax) ymax = d.y
  }

  function add(ds: Datum | Datum[]): void {
    if (!Array.isArray(ds)) return addOne(ds)

    ds.forEach(addOne)
  }

  function x(): [number, number] {
    const include = options.include ?? []
    const len = Math.abs(xmax - xmin === 0 ? xmax : xmax - xmin)

    let min = Math.min(xmin, ...include)
    if (min !== 0 || include[0] !== 0) min = min - len * padding.left

    let max = Math.max(xmax, ...include)
    if (max !== 0 || include[0] !== 0) max = max + len * padding.right

    return [min, max]
  }

  function y(): [number, number] {
    const include = options.include ?? []
    const len = Math.abs(ymax - ymin === 0 ? ymax : ymax - ymin)

    let min = Math.min(ymin, ...include)
    if (min !== 0 || include[0] !== 0) min = min - len * padding.left

    let max = Math.max(ymax, ...include)
    if (max !== 0 || include[0] !== 0) max = max + len * padding.right

    return [min, max]
  }

  function reversePad(xPercent: number, yPercent: number): void {
    const n = xs.length

    xs.sort((a, b) => a - b)
    ys.sort((a, b) => a - b)

    xmin = xs[Math.floor(n * (1 - xPercent))]
    xmax = xs[Math.floor(n * xPercent)]

    ymin = ys[Math.floor(n * (1 - yPercent))]
    ymax = ys[Math.floor(n * yPercent)]
  }

  function clear(): void {
    xs = []
    ys = []
  }

  return { add, x, y, reversePad, clear }
}
