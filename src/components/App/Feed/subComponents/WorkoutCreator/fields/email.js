import React from 'react'
import TextField from 'material-ui/TextField'

export default ({ onChange, errorText = null }) => {
  return (
    <TextField
      className='user_email'
      hintText='Enter Your Email so we can contact you'
      errorText={errorText}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
