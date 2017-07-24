import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { blue300 } from 'material-ui/styles/colors'
import DatePicker from 'material-ui/DatePicker'

const styles = {
  textFieldStyle: {
    color: blue300,
  },
}

const _Date = ({ onChange }) => {
  return (
    <div className='end-time'>
      <span> Pick A Workout Date <i className='fa fa-calendar' /></span>
      <DatePicker
        defaultDate={new Date()}
        hintText='Workout Date'
        className='date-time'
        textFieldStyle={styles.textFieldStyle}
        onChange={(event, date) => onChange(moment(date).toDate())}
      />
    </div>
  )
}

_Date.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default _Date
