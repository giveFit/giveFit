import React from 'react'
import { CardText, Chip, Avatar, Checkbox } from 'material-ui'

const styles = {
  container: {
    position: 'absolute',
    background: 'white',
    height: '80%',
    overflow: 'scroll',
    top: 0,
    right: 0
  },
  chip: {
    margin: 4
  }
}

class Activity extends React.Component {
  prepareWorkouts () {
    return this.props.workouts.map((workout, index) => {
      workout = workout.node

      return (
        <CardText key={`workout-${index}`}>
          <Chip
            onTouchTap={() => this.context.router.push('/profile')}
            style={styles.chip}
          >
            <Avatar
              src={workout.Workout.picture}
              onClick={() => this.context.router.push('/profile')}
            />
            {workout.Workout.nickname}
          </Chip>
          {
            <div>
              <p>Title: {workout.title}</p>
              <p>Date: {workout.date ? workout.date.substr(0, 10) : 'N/A'}</p>
              <p>Time: {workout.time ? workout.time.substr(11, 5) : 'N/A'}</p>
              <p>Description: {workout.description}</p>
            </div>
          }
          <Checkbox
            label='RSVP'
            style={styles}
            onCheck={() => {}}
          />
        </CardText>
      )
    })
  }

  render () {
    return (
      <div style={styles.container}>
        {this.prepareWorkouts()}
      </div>
    )
  }
}

Activity.propTypes = {
  workouts: React.PropTypes.array.isRequired
}

export default Activity
