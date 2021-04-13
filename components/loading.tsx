import React from 'react'
import Spinner from './spinner'

type Props = typeof defaultProps

const defaultProps = {}

export default function Loading(_: Props) {
  return (
    <div className="flex flex-center w-full h-full">
      <Spinner className="h-5 w-5 m-2" />
      Loading...
    </div>
  )
}

Loading.defaultProps = defaultProps
