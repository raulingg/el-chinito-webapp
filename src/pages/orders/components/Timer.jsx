import React from 'react'
import useTimer from '../../../hooks/useTimer'

const Timer = ({ startedAt = new Date() }) => {
  const time = useTimer(startedAt)

  return <span>{`${time.hours}h ${time.minutes}min`}</span>
}

export default Timer
