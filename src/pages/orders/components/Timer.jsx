import React from 'react'
import useTimer from '../../../hooks/useTimer'
import PropTypes from 'prop-types'

const Timer = ({ placedAt }) => {
  const time = useTimer({ start: new Date(placedAt) })

  return <span>{`${time.hours}h ${time.minutes}min`}</span>
}

Timer.propTypes = {
  placedAt: PropTypes.string.isRequired,
}

export default Timer
