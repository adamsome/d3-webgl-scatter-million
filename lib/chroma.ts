interface ChromaDef {
  id: string
  name: string
  type: 'sequential-single' | 'sequential-multi' | 'diverging' | 'cyclical'
  mode: 'light' | 'dark'
}

const CHROMA: ChromaDef[] = [
  { id: 'BuGn', name: 'Blue Green', type: 'sequential-multi', mode: 'light' },
  { id: 'BuPu', name: 'Blue Purple', type: 'sequential-multi', mode: 'light' },
  { id: 'GnBu', name: 'Green Blue', type: 'sequential-multi', mode: 'light' },
  { id: 'OrRd', name: 'Orange Red', type: 'sequential-multi', mode: 'light' },
  {
    id: 'PuBuGn',
    name: 'Purple Blue Green',
    type: 'sequential-multi',
    mode: 'light',
  },
  { id: 'PuBu', name: 'Purple Blue', type: 'sequential-multi', mode: 'light' },
  { id: 'PuRd', name: 'Purple Red', type: 'sequential-multi', mode: 'light' },
  { id: 'RdPu', name: 'Red Purple', type: 'sequential-multi', mode: 'light' },
  {
    id: 'YlGnBu',
    name: 'Yellow Green Blue',
    type: 'sequential-multi',
    mode: 'light',
  },
  { id: 'YlGn', name: 'Yellow Green', type: 'sequential-multi', mode: 'light' },
  {
    id: 'YlOrBr',
    name: 'Yellow Orange Brown',
    type: 'sequential-multi',
    mode: 'light',
  },
  {
    id: 'YlOrRd',
    name: 'Yellow Orange Red',
    type: 'sequential-multi',
    mode: 'light',
  },

  { id: 'Blues', name: 'Blues', type: 'sequential-single', mode: 'light' },
  { id: 'Greens', name: 'Greens', type: 'sequential-single', mode: 'light' },
  { id: 'Greys', name: 'Grays', type: 'sequential-single', mode: 'light' },
  { id: 'Purples', name: 'Purples', type: 'sequential-single', mode: 'light' },
  { id: 'Reds', name: 'Reds', type: 'sequential-single', mode: 'light' },
  { id: 'Oranges', name: 'Oranges', type: 'sequential-single', mode: 'light' },

  {
    id: 'CubehelixDefault',
    name: 'Cubehelix',
    type: 'sequential-multi',
    mode: 'dark',
  },
  { id: 'Viridis', name: 'Viridis', type: 'sequential-multi', mode: 'dark' },
  { id: 'Cividis', name: 'Cividis', type: 'sequential-multi', mode: 'dark' },
  { id: 'Cool', name: 'Cool', type: 'sequential-multi', mode: 'dark' },
  { id: 'Warm', name: 'Warm', type: 'sequential-multi', mode: 'dark' },
  { id: 'Inferno', name: 'Inferno', type: 'sequential-multi', mode: 'dark' },
  { id: 'Magma', name: 'Magma', type: 'sequential-multi', mode: 'dark' },
  { id: 'Plasma', name: 'Plasma', type: 'sequential-multi', mode: 'dark' },
  { id: 'Turbo', name: 'Turbo', type: 'sequential-multi', mode: 'dark' },

  { id: 'Rainbow', name: 'Rainbow', type: 'cyclical', mode: 'dark' },
  { id: 'Sinebow', name: 'Sinebow', type: 'cyclical', mode: 'dark' },

  { id: 'Spectral', name: 'Spectral', type: 'diverging', mode: 'dark' },
  { id: 'BrBG', name: 'Brown Blue-Green', type: 'diverging', mode: 'dark' },
  { id: 'PiYG', name: 'Pink Yellow-Green', type: 'diverging', mode: 'dark' },
  { id: 'PRGn', name: 'Purple Green', type: 'diverging', mode: 'dark' },
  { id: 'PuOr', name: 'Purple Orange', type: 'diverging', mode: 'dark' },
  { id: 'RdBu', name: 'Red Blue', type: 'diverging', mode: 'dark' },
  { id: 'RdGy', name: 'Red Gray', type: 'diverging', mode: 'dark' },
  { id: 'RdYlBu', name: 'Red Yellow Blue', type: 'diverging', mode: 'dark' },
  {
    id: 'RdYlGn',
    name: 'Red Yellow Green',
    type: 'diverging',
    mode: 'dark',
  },
]

interface ChromaGroup {
  name: string
  items: ChromaDef[]
}

const dark = CHROMA.filter((c) => c.mode === 'dark')
const light = CHROMA.filter((c) => c.mode === 'light')

export const CHROMA_GROUPS: ChromaGroup[] = [
  {
    name: 'Dark, Sequential',
    items: dark.filter((c) => c.type === 'sequential-multi'),
  },
  {
    name: 'Dark, Cyclical',
    items: dark.filter((c) => c.type === 'cyclical'),
  },
  {
    name: 'Dark, Diverging',
    items: dark.filter((c) => c.type === 'diverging'),
  },
  {
    name: 'Light, Multi-hue',
    items: light.filter((c) => c.type === 'sequential-multi'),
  },
  {
    name: 'Light, Single-hue',
    items: light.filter((c) => c.type === 'sequential-single'),
  },
]

export default CHROMA
