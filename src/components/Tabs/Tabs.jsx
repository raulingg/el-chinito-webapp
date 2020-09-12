import React from 'react'

const Tabs = ({ value, children }) => (
  <ul className="flex border-b border-black">
    {React.Children.map(children, (tab) => React.cloneElement(tab, { value }))}
  </ul>
)

export default Tabs
