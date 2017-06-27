import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'

const Title = ({ onChange, errorText = null }) => {
  return (
    <TextField
      id='workout_title'
      hintText='Workout Title'
      onChange={(e) => onChange(e.target.value)}
      errorText={errorText}
    />
  )
}

Title.propTypes = {
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
}

export default Title
