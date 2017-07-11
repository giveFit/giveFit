import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { graphql, compose } from 'react-apollo'

import { CardText, Chip, Avatar, Snackbar } from 'material-ui'

import { ADD_RSVP_FOR_WORKOUT, REMOVE_RSVP_FOR_WORKOUT, DELETE_WORKOUT, GET_THROUGH_VIEWER } from './gql.js'

import './styles.css'

class Activities extends React.Component {
  constructor (props) {
    super(props)

    this.message = ''

    this.workouts = {}

    this.state = {
      workouts: [],
      snack: false,
      autoHideDuration: 2000,
      userId: JSON.parse(window.localStorage.getItem('scapholdUserId')),
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.loading) {
      const allWorkouts = nextProps.viewer.allWorkouts.edges
      const workouts = []

      for (let i = 0; i < allWorkouts.length; i++) {
        const workout = allWorkouts[i]

        const isUserRSVPed = workout.node.RSVPsForWorkout.edges.reduce((previous, current) => {
          if (previous === true) {
            return true
          }

          return current.node.id === this.state.userId
        }, false)

        workouts.push(Object.assign({}, workout.node, { isUserRSVPed }))
      }

      this.setState({
        workouts,
      })
    }
  }

  handleRequestClose () {
    this.setState({snack: false})
  }

  addRSVPForWorkout (workoutId, index) {
    this.props.addRSVPForWorkout({
      workoutId,
      // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      userId: this.state.userId,
    })
      .then(() => {
        this.message = 'Event added to your calendar'

        const workouts = this.state.workouts.slice()
        workouts[index] = Object.assign({}, workouts[index], { isUserRSVPed: true })

        this.setState({
          snack: !this.state.snack,
          workouts,
        })
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  removeRSVPForWorkout (workoutId, index) {
    this.props.removeRSVPForWorkout({
      workoutId,
      // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      userId: this.state.userId,
    })
      .then(() => {
        this.message = 'Event removed from your calendar'

        const workouts = this.state.workouts.slice()
        workouts[index] = Object.assign({}, workouts[index], { isUserRSVPed: false })

        this.setState({
          snack: !this.state.snack,
          workouts,
        })
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  editWorkout (workoutId, index) {
    // call activity container
  }

  deleteWorkout (workoutId, name, index) {
    this.props.deleteWorkout({
      id: workoutId,
    })
      .then(() => {
        this.message = `Deleted Workout ${name}`

        const workouts = this.state.workouts.slice()
        delete workouts[index]

        this.setState({
          snack: !this.state.snack,
          workouts,
        })
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

  handleWorkoutClick (workout) {
    this.props.handleWorkoutClick(workout.parkId, workout.id)

    this.clickedWorkout = workout.id
  }

  prepareRSVPButton (workout, index) {
    if (!this.state.userId) {
      return
    }

    if (workout.isUserRSVPed) {
      return (
        <i
          className='fa fa-check-circle __share__icon'
          onTouchTap={() => this.removeRSVPForWorkout(workout.id, index)}
        />
      )
    }

    return (
      <i
        className='fa fa-check-circle-o __share__icon'
        onTouchTap={() => this.addRSVPForWorkout(workout.id, index)}
      />
    )
  }

  WorkoutList () {
    return this.state.workouts
      .map((workout, index) => {
        const RSVPCount = workout.RSVPsForWorkout.edges.length

        if (!this.props.indexedParks[workout.parkId]) {
          return null
        }

        return (
          <CardText
            key={`workout-${index}`}
            className={this.props.selectedWorkoutId === workout.id ? '__selected__workout' : ''}

          >
            <div className='__workout__header' ref={(c) => { this.workouts[workout.id] = c }}>
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
              {workout.Workout.id === this.state.userId &&
                <div className='__workout__edit'>
                  <i
                    className='fa fa-pencil'
                    onTouchTap={() => this.editWorkout(workout.id, index)}
                  />
                  <i
                    className='fa fa-trash'
                    onTouchTap={() => this.deleteWorkout(workout.id, workout.title, index)}
                  />
                </div>
              }
            </div>
            <div className='__workout__image__container'>
              <img
                width='100%'
                src={workout.pictureURL}
                onClick={() => this.handleWorkoutClick(workout)}
              />
              <div className='__workout__information'>
                <div>
                  <span>{moment(workout.startDateTime).format('ddd MMM Do, YYYY h:mm a')} - {moment(workout.endDateTime).format('LT')}</span>
                  <br />
                  <span>{this.props.indexedParks[workout.parkId].title}</span>
                  <br />
                  {Boolean(RSVPCount) && <span>RSVPed: {RSVPCount}</span>}
                </div>
                <div>{this.prepareRSVPButton(workout, index)}</div>
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

  componentDidUpdate () {
    if (this.clickedWorkout) {
      this.workouts[this.clickedWorkout].scrollIntoView(true)

      delete this.clickedWorkout
    }
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
  handleWorkoutClick: PropTypes.func.isRequired,

  // graphql props
  addRSVPForWorkout: PropTypes.func.isRequired,
  removeRSVPForWorkout: PropTypes.func.isRequired,
  deleteWorkout: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  viewer: PropTypes.object,
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
  graphql(DELETE_WORKOUT, {
    props: ({ mutate }) => ({
      deleteWorkout: (input) => mutate({ variables: { input: input } }),
    }),
  }),
  graphql(GET_THROUGH_VIEWER, {
    options: ({ openedParkId }) => {
      const query = {
        variables: {
          first: 100,
          where: {
            endDateTime: {
              gte: new Date().toString(),
            },
          },
          orderBy: {
            field: 'startDateTime',
            direction: 'ASC',
          },
        },
      }

      if (openedParkId) {
        query.variables.where.parkId = {
          eq: openedParkId,
        }
      }

      return query
    },
    props: ({ data: { viewer, loading } }) => {
      return {
        viewer,
        loading,
      }
    },
  })
)(Activities)

export default ActivitiesWithData
