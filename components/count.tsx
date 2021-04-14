import { useThrottle } from '@react-hook/throttle'
import React, { useEffect } from 'react'
import { useCountUp } from 'react-countup'

type Props = typeof defaultProps & {
  count: number
}

const defaultProps = {}

const FPS = 0.5

export default function Count({ count: rawCount }: Props) {
  const [count, setCount] = useThrottle(rawCount, FPS)
  const { countUp, start, update } = useCountUp({
    start: 0,
    end: count,
    duration: 1 / FPS,
    separator: ',',
  })

  useEffect(() => {
    start()
  }, [])

  useEffect(() => {
    setCount(rawCount)
  }, [rawCount])

  useEffect(() => {
    update(count)
  }, [count])

  return <span className="font-semibold">{countUp}</span>
}

Count.defaultProps = defaultProps
