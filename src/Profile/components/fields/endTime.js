import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import TimePicker from 'material-ui/TimePicker'
import { blue300 } from 'material-ui/styles/colors'

const styles = {
  textFieldStyle: {
    color: blue300,
  },
}

const EndTime = ({ onChange }) => {
  return (
    <div className='end-time'>
      <span> Pick an End Time <i className='fa fa-clock-o' /></span>
      <TimePicker
        hintText='End Time'
        className='date-time'
        textFieldStyle={styles.textFieldStyle}
        onChange={(event, time) => onChange(moment(time).toDate())}
      />
    </div>
  )
}

EndTime.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default EndTime
