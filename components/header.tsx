import dynamic from 'next/dynamic'
import Slider from './slider'
import ThemeSwitch from './theme-switch'

type Props = typeof defaultProps & {
  hexRadius: number
  chroma: string
  onHexRadiusChange?: (value: number) => void
  onChromaChange?: (value: string) => void
}

const defaultProps = {}

const ChromaSelect = dynamic(() => import('../components/chroma-select'), {
  ssr: false,
})

export default function Header({
  hexRadius,
  chroma,
  onHexRadiusChange,
  onChromaChange,
}: Props) {
  return (
    <nav className="fixed flex-center w-full h-24 py-2 px-6 border-b dark:border-gray-900 transition-colors">
      <div className="flex-1"></div>

      <Slider value={hexRadius} onChange={onHexRadiusChange} />
      <ChromaSelect value={chroma} onChange={onChromaChange} />
      <ThemeSwitch />
    </nav>
  )
}

Header.defaultProps = defaultProps
