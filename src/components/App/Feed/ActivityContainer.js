import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import { CardText, Chip, Avatar, RaisedButton } from 'material-ui'

const styles = {
  container: {
    position: 'absolute',
    border: '3px solid #efefef',
    margin: '0.2em',
    background: 'white',
    height: '80%',
    overflow: 'scroll',
    top: 0,
    right: 0
  },
  workoutHeader: {
    display: 'flex'
  },
  workoutTitle: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    paddingLeft: '1em',
    justifyContent: 'space-between'
  },
  workoutDate: {
    color: 'grey',
    padding: '1em 1em 1em 0'
  },
  workoutDescription: {
    borderBottom: '2px solid #efefef'
  },
  buttonContainer: {
    borderBottom: '2px solid #efefef',
    display: 'flex',
    justifyContent: 'space-between'
  },
  rsvpButton: {
    margin: '1em 0',
    boxShadow: '3px 3px 8px black',
    cursor: 'pointer'
  },
  shareButton: {
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer'
  },
  shareIcon: {
    fontSize: '2em',
    paddingLeft: '0.5em'
  },
  editIcon: {
    color: 'grey',
    paddingLeft: '0.4em',
    fontSize: '1.2em',
    cursor: 'pointer'
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
          <div className='workout-header' style={styles.workoutHeader}>
            <Chip
              onTouchTap={() => this.context.router.push('/profile')}
              style={styles.chip}
            >
              <Avatar
                src={workout.Workout.picture}
                onClick={() => this.context.router.push('/profile')}
              />
              <span>{workout.Workout.nickname}</span>
            </Chip>
            <div style={styles.workoutTitle}>
              {workout.title}
              <i className='fa fa-pencil' style={styles.editIcon} />
            </div>
          </div>
          <div className='workout-date' style={styles.workoutDate}>
            {workout.date ? moment(workout.date).format('ddd MMM Do') : 'N/A'} {workout.time ? moment(workout.time).format('LT') : 'N/A'}
          </div>
          <div className='workout-description' style={styles.workoutDescription}>
            {workout.description}
          </div>
          <div className='button-container' style={styles.buttonContainer}>
            <RaisedButton
              backgroundColor={'#1F01B9'}
              labelColor={'white'}
              label='RSVP'
              style={styles.rsvpButton}
            />
            <div className='share-button' style={styles.shareButton}>
              <span>Share</span>
              <i className='fa fa-share' style={styles.shareIcon} />
            </div>
          </div>
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
  workouts: PropTypes.array.isRequired
}

export default Activity
