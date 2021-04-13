export default function TsvParser() {
  const decoder = new TextDecoder('utf-8')
  let columns: string[]
  let lastBuffer = ''

  function _parse(lines: string[]) {
    const rows = lines.map((line) => {
      const values = line.split('\t')
      if (values.length !== columns.length) return null

      return columns.reduce((acc, col, i) => {
        acc[col] = values[i]
        return acc
      }, {} as Record<string, string>)
    })

    return rows.filter((r) => r != null)
  }

  return {
    parse(buffer?: ArrayBufferView | ArrayBuffer) {
      const text = lastBuffer + decoder.decode(buffer)
      const lines = text.split('\n')

      // Set the columns from the 1st line if not set
      if (!columns) {
        columns = lines[0].split('\t')
        lines.shift()
      }

      lastBuffer = lines.pop() || ''

      return _parse(lines)
    },

    parseLast() {
      return _parse([lastBuffer])
    },
  }
}
