import React from 'react'
import './chip.css'
import PropTypes from 'prop-types'

const Chip = ({ label = 'Chip', color = 'default', className }) => (
  <div className={`${className} chip chip--color-${color}`}>
    <span>{label}</span>
  </div>
)

Chip.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
}

export default Chip
