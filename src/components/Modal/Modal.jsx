import React from 'react'
import PropTypes from 'prop-types'

import './modal.css'

const Modal = ({ open, maxWidth, children }) => {
  return (
    <div className="modal" hidden={!open}>
      <div className={`modal__container max-w-${maxWidth}`}>{children}</div>
    </div>
  )
}

Modal.defaultProps = {
  open: false,
  maxWidth: 'md',
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
}

export default Modal
