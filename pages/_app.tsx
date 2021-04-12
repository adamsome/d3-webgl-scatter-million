import { AppProps } from 'next/dist/next-server/lib/router/router'
import React from 'react'
import '../styles/globals.css'
import { ThemeProvider } from '../util/use-theme'

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false} attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App
