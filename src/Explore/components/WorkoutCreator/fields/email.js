import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'

const Email = ({ onChange, errorText = null }) => {
  return (
    <TextField
      className='user_email'
      hintText='Enter Your Email so we can contact you'
      errorText={errorText}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

Email.propTypes = {
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
}

export default Email
