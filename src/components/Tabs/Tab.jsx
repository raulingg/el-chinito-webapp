import React from 'react'
import { Link } from 'react-router-dom'
import './tabs.css'

const Tab = ({ children, index, value, ...rest }) => (
  <li className={`tab ${index === value ? 'tab--active' : ''}`}>
    <Link {...rest}>{children}</Link>
  </li>
)

export default Tab
