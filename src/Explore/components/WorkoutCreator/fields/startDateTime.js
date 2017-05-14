import React from 'react'
import PropTypes from 'prop-types'

import Datetime from 'react-datetime'

const StartDateTime = ({ onChange }) => {
  return (
    <div className='start-time'>
      <span> Pick a Start Time <i className='fa fa-clock-o' /></span>
      <Datetime
        onChange={(moment) => onChange(moment)}
        className='date-time'
      />
    </div>
  )
}

StartDateTime.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default StartDateTime
