import { useEffect, useState } from 'react'
import { calculateTimeElapsed } from '../utils'

const useTimer = ({ start }) => {
  const [time, setTime] = useState(calculateTimeElapsed(start))

  useEffect(() => {
    const timer = setTimeout(() => setTime(calculateTimeElapsed(start)), 1000)

    return () => clearTimeout(timer)
  })

  return time
}

export default useTimer
