import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import './modal.css'

const Modal = ({
  open,
  maxWidth,
  disableBackdropClick,
  disableEscapeKeyDown,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (disableEscapeKeyDown || !open) {
      return
    }

    const handleKeydown = (e) => {
      e.stopPropagation()

      return e.code === 'Escape' && onClose()
    }

    document.addEventListener('keydown', handleKeydown)

    return () => document.removeEventListener('keydown', handleKeydown)
  }, [open])

  const handleClick = (e) => {
    e.stopPropagation()
    if (disableBackdropClick) return

    const [modal] = document.getElementsByClassName('modal')

    if (modal != e.target) return

    onClose()
  }

  return (
    <div className="modal" hidden={!open} onClick={handleClick}>
      <div className={`modal__container max-w-${maxWidth}`}>{children}</div>
    </div>
  )
}

Modal.defaultProps = {
  open: false,
  maxWidth: 'md',
  disableBackdropClick: false,
  disableEscapeKeyDown: false,
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool,
  onClose: PropTypes.func,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
}

export default Modal
