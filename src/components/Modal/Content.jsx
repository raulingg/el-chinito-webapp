import React from 'react'

const Content = ({ withDividers = true, children }) => (
  <div
    className={`modal__content ${
      withDividers ? 'modal__content-dividers' : ''
    }`}>
    {children}
  </div>
)

export default Content
