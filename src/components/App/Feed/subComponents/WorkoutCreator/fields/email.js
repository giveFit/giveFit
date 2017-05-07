import React from 'react'
import TextField from 'material-ui/TextField'

export default ({ onChange }) => {
  return (
    <TextField
      className='user_email'
      hintText='Enter Your Email so we can contact you'
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
