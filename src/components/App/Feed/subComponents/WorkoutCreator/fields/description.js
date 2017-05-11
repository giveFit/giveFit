import React from 'react'
import TextField from 'material-ui/TextField'

export default ({ onChange, errorText = null }) => {
  return (
    <TextField
      id='workout_description'
      hintText='Description'
      errorText={errorText}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
