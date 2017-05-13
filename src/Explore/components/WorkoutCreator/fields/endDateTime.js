import React from 'react'
import Datetime from 'react-datetime'

export default ({ onChange }) => {
  return (
    <div className='end-time'>
      <span> Pick an End Time <i className='fa fa-clock-o' /></span>
      <Datetime
        onChange={(moment) => onChange(moment)}
        className='date-time'
      />
    </div>
  )
}
