import React from 'react'
import { CardText, Chip, Avatar, Checkbox } from 'material-ui'

const inlineStyles = {
  subtitleStyle: {
    subtitleColor: 'rgba(211, 211, 211)'
  },
  chip: {
    margin: 4
  },
  gridList: {
    width: 500,
    height: 250,
    overflowY: 'auto'
  },
  rating: {
    float: 'left'
  },
  save: {
    padding: '10px'
  }
}

export default class Activity extends React.Component {
  prepareWorkouts () {
    return this.props.workouts.map((workout) => {
      workout = workout.node;

      return (
        <CardText>
          <Chip
            onTouchTap={() => this.context.router.push('/profile')}
            style={inlineStyles.chip}
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
        </CardText>
      )
    })
  }

  render () {
    const { workouts } = this.props

    return (
      <div>
        {this.prepareWorkouts()}
      </div>
    )
  }
}
