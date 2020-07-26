import React from 'react'

const Tabs = ({ value, onChange, children }) => (
  <ul className="flex border-b border-black">
    {React.Children.map(children, (tab, index) =>
      React.cloneElement(tab, {
        index,
        value,
        onChange: (e) => onChange(e, index),
      }),
    )}
  </ul>
)

export default Tabs
