import React from 'react'
import TextField from 'material-ui/TextField'

export default ({ onChange }) => {
  return (
    <TextField
      id='workout_description'
      hintText='Description'
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
