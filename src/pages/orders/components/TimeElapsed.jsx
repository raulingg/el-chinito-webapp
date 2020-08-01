import React from 'react'
import useTimer from '../../../hooks/useTimer'
import PropTypes from 'prop-types'
import { calculateTimeElapsed } from '../../../utils'

const TimeElapsed = ({ placedAt, deliveredAt }) => {
  const timeElapsed = calculateTimeElapsed(
    new Date(placedAt),
    new Date(deliveredAt),
  )

  return <span>{`${timeElapsed.hours}h ${timeElapsed.minutes}min`}</span>
}

TimeElapsed.propTypes = {
  placedAt: PropTypes.string.isRequired,
  deliveredAt: PropTypes.string.isRequired,
}

export default TimeElapsed
