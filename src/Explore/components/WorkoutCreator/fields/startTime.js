import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import TimePicker from 'material-ui/TimePicker'

const StartTime = ({ onChange }) => {
  return (
    <div className='start-time'>
      <span> Pick a Start Time <i className='fa fa-clock-o' /></span>
      <TimePicker
        hintText='Start Time'
        className='date-time'
        onChange={(event, time) => onChange(moment(time))}
      />
    </div>
  )
}

StartTime.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default StartTime
