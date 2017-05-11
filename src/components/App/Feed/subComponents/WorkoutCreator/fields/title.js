import React from 'react'
import TextField from 'material-ui/TextField'

export default ({ onChange, errorText = null }) => {
  return (
    <TextField
      id='workout_title'
      hintText='Workout Title'
      onChange={(e) => onChange(e.target.value)}
      errorText={errorText}
    />
  )
}
