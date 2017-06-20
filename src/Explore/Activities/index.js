import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { graphql, compose } from 'react-apollo'

import { CardText, Chip, Avatar, Snackbar } from 'material-ui'

import { ADD_RSVP_FOR_WORKOUT, REMOVE_RSVP_FOR_WORKOUT } from './gql.js'

import './styles.css'

class Activities extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      snack: false,
      autoHideDuration: 2000,
      userId: JSON.parse(window.localStorage.getItem('scapholdUserId')),
    }
  }

  handleRequestClose () {
    this.setState({snack: false})
  }

  addRSVPForWorkout (workoutId) {
    this.props.addRSVPForWorkout({
      workoutId,
      // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      userId: this.state.userId,
    })
      .then(() => {
        this.message = 'Event added to your calendar'

        this.setState({ snack: !this.state.snack })
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  removeRSVPForWorkout (workoutId) {
    this.props.removeRSVPForWorkout({
      workoutId,
      // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      userId: this.state.userId,
    })
      .then(() => {
        this.message = 'Event removed from your calendar'

        this.setState({ snack: !this.state.snack })
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  handleTouchTap () {
    window.alert('You clicked the Chip.')
  }

  handleActionTouchTap () {
    this.setState({snack: false})
    window.alert('Event removed from your calendar.')
  }

  WorkoutList () {
    return this.props.workouts
      .map((workout, index) => {
        workout = workout.node

        const RSVPCount = workout.RSVPsForWorkout.edges.length
        const isUserRSVPed = workout.RSVPsForWorkout.edges.reduce((previous, current) => {
          if (previous === true) {
            return true
          }

          return current.node.id === this.state.userId
        }, false)

        if (!this.props.indexedParks[workout.parkId]) {
          return null
        }
        return (
          <CardText
            key={`workout-${index}`}
            className={this.props.selectedWorkoutId === workout.id ? '__selected__workout' : ''}
          >
            <div className='__workout__header'>
              <Chip
                onTouchTap={() => this.context.router.push('/profile')}
                className='__chip'
              >
                <Avatar
                  src={workout.Workout.picture}
                  onClick={() => this.context.router.push('/profile')}
                />
                <span>{workout.Workout.nickname}</span>
              </Chip>
              <div className='__workout__title'>
                <span> <b>{workout.title}</b> </span>
                <span>{workout.type}</span>
              </div>
            </div>
            <div className='__workout__image__container'>
              <img
                width='100%'
                onClick={() => this.props.handleWorkoutClick(workout.parkId, workout.id)}
                // height='300'
                src={workout.pictureURL}
              />
              <div className='__workout__information'>
                <div>
                  <span>{moment(workout.startDateTime).format('ddd MMM Do, YYYY h:mm a')} - {moment(workout.endDateTime).format('LT')}</span>
                  <br />
                  <span>{this.props.indexedParks[workout.parkId].title}</span>
                  <br />
                  {Boolean(RSVPCount) && <span>RSVPed: {RSVPCount}</span>}
                </div>
                <div>
                  {
                    isUserRSVPed
                      ? <i
                        className='fa fa-check-circle __share__icon'
                        onTouchTap={() => this.removeRSVPForWorkout(workout.id)}
                      />
                      : <i
                        className='fa fa-check-circle-o __share__icon'
                        onTouchTap={() => this.addRSVPForWorkout(workout.id)}
                      />
                  }
                </div>
                <div><i className='fa fa-share __share__icon' /></div>
              </div>
            </div>
            {workout.description && <div className='__description_container'>
              <div><b>Description</b></div>
              <div>{workout.description}</div>
            </div>}
            <Snackbar
              open={this.state.snack}
              message={this.message}
              action="undo"
              autoHideDuration={this.state.autoHideDuration}
              onActionTouchTap={this.handleActionTouchTap.bind(this)}
              onRequestClose={this.handleRequestClose.bind(this)}
            />
          </CardText>
        )
      })
  }

  render () {
    return (
      <div className='__activities'>
        {this.WorkoutList()}
      </div>
    )
  }
}

Activities.propTypes = {
  indexedParks: PropTypes.object.isRequired,
  selectedWorkoutId: PropTypes.string,
  workouts: PropTypes.array.isRequired,
  handleWorkoutClick: PropTypes.func.isRequired,
  addRSVPForWorkout: PropTypes.func.isRequired,
  removeRSVPForWorkout: PropTypes.func.isRequired,
}

const ActivitiesWithData = compose(
  graphql(ADD_RSVP_FOR_WORKOUT, {
    props: ({ mutate }) => ({
      addRSVPForWorkout: (input) => mutate({ variables: { input: input } }),
    }),
  }),
  graphql(REMOVE_RSVP_FOR_WORKOUT, {
    props: ({ mutate }) => ({
      removeRSVPForWorkout: (input) => mutate({ variables: { input: input } }),
    }),
  }),
)(Activities)

export default ActivitiesWithData
