import { color as d3Color } from 'd3-color'

export default function color(color: string) {
  const { r, g, b, opacity } = d3Color(color).rgb()
  return [r / 255, g / 255, b / 255, opacity]
}
