import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'

const Description = ({ onChange, errorText = null }) => {
  return (
    <TextField
      id='workout_description'
      hintText='Description'
      floatingLabelText="MultiLine and FloatingLabel"
      multiLine={true}
      rows={2}
      errorText={errorText}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

Description.propTypes = {
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
}

export default Description
