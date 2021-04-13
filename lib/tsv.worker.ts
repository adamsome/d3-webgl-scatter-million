/// <reference lib="webworker" />

import TsvParser from './tsv-parser'

function handleError(message: string): null {
  const msg = message || 'Unknown error in TSV worker.'
  console.error('Error in TSV worker:', msg)
  postMessage({ error: msg })
  return null
}

async function fetchResponse(url: string): Promise<Response | null> {
  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return handleError(err && err.message)
  }

  if (!res.ok) {
    if (!res.body) {
      return handleError(res.statusText)
    }

    try {
      const data = await res.body.getReader().read()
      const message = new TextDecoder('utf-8').decode(data.value)
      const error = 'Error fetching data in TSV worker.'
      return handleError(
        `${error} ${res.status} (${res.statusText}): ${message}`
      )
    } catch (err) {
      return handleError(err && err.message)
    }
  }

  return res
}

onmessage = async (event: MessageEvent<string>) => {
  const url = event.data
  const res = await fetchResponse(url)

  const parser = TsvParser()
  let bytes = 0

  const stream = new Response(
    new ReadableStream({
      start(ctrl: ReadableStreamDefaultController) {
        if (!res || !res.body)
          return handleError('TSV worker response has no content.')

        const reader = res.body.getReader()

        const read = async () => {
          const result = await reader.read()
          if (result.done) {
            ctrl.close()
            return
          }

          const data = parser.parse(result.value)

          bytes += result.value ? result.value.byteLength : 0

          postMessage({ data, bytes })

          ctrl.enqueue(result.value)
          read()
        }

        read()
      },
    })
  )

  const text = await stream.text()

  // Return any remaining data in the buffer
  const data = parser.parseLast()

  postMessage({ data, bytes: text.length, done: true })
}
