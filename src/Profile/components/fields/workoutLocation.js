import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'

class WorkoutLocation extends React.Component {
  render () {
    return (
      <div style={{marginTop: 18}}>
        <span> Location name </span>
        <br />
        <TextField
          style={{marginTop: 5, marginLeft: 10}}
          hintText="Workout Location"
          onChange={(e, value) => this.props.onChange(value)}
        /><br />
      </div>
    )
  }
}

WorkoutLocation.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default WorkoutLocation
