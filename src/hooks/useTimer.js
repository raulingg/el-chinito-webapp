import { useEffect, useState } from 'react'

const calculateTime = (startedAt) => {
  const difference = +new Date() - +startedAt

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

const useTimer = (startedAt = new Date()) => {
  const [time, setTime] = useState(calculateTime(startedAt))

  useEffect(() => {
    const timer = setTimeout(() => setTime(calculateTime(startedAt)), 1000)

    return () => clearTimeout(timer)
  })

  return time
}

export default useTimer
