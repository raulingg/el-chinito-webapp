import React from 'react'
import './tabs.css'

const Tab = ({ label, onChange, index, value }) => (
  <li className={`tab ${index === value ? 'tab--active' : ''}`}>
    <a title={label} onClick={onChange} href="#">
      {label}
    </a>
  </li>
)

export default Tab
