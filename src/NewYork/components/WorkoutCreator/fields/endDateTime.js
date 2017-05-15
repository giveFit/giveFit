import React from 'react'
import PropTypes from 'prop-types'

import Datetime from 'react-datetime'

const EndDateTime = ({ onChange }) => {
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

EndDateTime.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default EndDateTime
