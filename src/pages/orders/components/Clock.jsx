import React, { useState, useEffect } from 'react'
import { makeFormatter } from '../../../utils'

const Clock = () => {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const timer = setTimeout(() => setDate(new Date()), 1000)

    return () => clearTimeout(timer)
  })

  return (
    <>
      <span className="sm:hidden lg:block">
        {makeFormatter({
          options: { dateStyle: 'full', timeStyle: 'short' },
        }).format(date)}
      </span>
      <span className="sm:block lg:hidden">
        {makeFormatter({
          options: { dateStyle: 'short', timeStyle: 'short' },
        }).format(date)}
      </span>
    </>
  )
}

export default Clock
