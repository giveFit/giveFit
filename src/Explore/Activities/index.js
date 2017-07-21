import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { graphql, compose } from 'react-apollo'

import { CardText, Chip, Avatar, Snackbar, RaisedButton, Paper } from 'material-ui'
import PersonAdd from 'material-ui/svg-icons/social/person-add'
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center'

import {
  ADD_RSVP_FOR_WORKOUT,
  REMOVE_RSVP_FOR_WORKOUT,
  DELETE_WORKOUT,
} from './gql.js'

import './styles.css'

class Activities extends React.Component {
  constructor (props) {
    super(props)

    this.message = ''

    this.refWorkouts = {}

    const userId = JSON.parse(window.localStorage.getItem('scapholdUserId'))

    this.state = {
      workouts: this.props.workouts,
      snack: false,
      autoHideDuration: 2000,
      userId,
    }
  }

  componentWillReceiveProps (nextProps) {
    const workoutsLength = nextProps.workouts.length

    if (!workoutsLength || workoutsLength !== this.props.workouts.length) {
      this.setState({
        workouts: nextProps.workouts,
      })
    }
  }

  handleRequestClose () {
    this.setState({ snack: false })
  }

  addRSVPForWorkout (workoutId, index) {
    this.props
      .addRSVPForWorkout({
        workoutId,
        // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
        userId: this.state.userId,
      })
      .then(() => {
        this.message = 'Event added to your calendar'
        const workouts = this.state.workouts.slice()
        workouts[index] = Object.assign({}, workouts[index], {
          isUserRSVPed: true,
        })

        this.setState({
          snack: !this.state.snack,
          workouts,
        })
      })
      .catch(error => {
        console.warn(error)
      })
  }

  removeRSVPForWorkout (workoutId, index) {
    this.props
      .removeRSVPForWorkout({
        workoutId,
        // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
        userId: this.state.userId,
      })
      .then(() => {
        this.message = 'Event removed from your calendar'

        const workouts = this.state.workouts.slice()
        workouts[index] = Object.assign({}, workouts[index], {
          isUserRSVPed: false,
        })

        this.setState({
          snack: !this.state.snack,
          workouts,
        })
      })
      .catch(error => {
        console.warn(error)
      })
  }

  editWorkout (workoutId, index) {
    // call activity container
  }

  deleteWorkout (workoutId, name, index) {
    this.props
      .deleteWorkout({
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
      .catch(error => {
        console.warn(error)
      })
  }

  handleTouchTap () {
    window.alert('You clicked the Chip.')
  }

  handleActionTouchTap () {
    this.setState({ snack: false })
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
        <RaisedButton
          label="You have RSVP'd!"
          labelPosition="before"
          secondary={true}
          icon={<FitnessCenter />}
          style={styles.button}
          onTouchTap={() => this.removeRSVPForWorkout(workout.id, index)}
        />
      )
    }
    return (
      <RaisedButton
        label="RSVP to this Class"
        labelPosition="before"
        primary={true}
        icon={<PersonAdd />}
        style={styles.button}
        onTouchTap={() => this.addRSVPForWorkout(workout.id, index)}
      />
    )
  }

  WorkoutList () {
    return this.state.workouts.map((workout, index) => {
      const RSVPCount = workout.RSVPsForWorkout.edges.length

      if (!this.props.indexedParks[workout.parkId]) {
        return null
      }

      return (
        <Paper zDepth={5} key={`workout-${index}`}>
          <CardText
            className={
              this.props.selectedWorkoutId === workout.id
                ? '__selected__workout'
                : ''
            }
          >
            <div
              className="__workout__header"
              ref={c => {
                this.refWorkouts[workout.id] = c
              }}
            >
              <Chip
                onTouchTap={() => this.context.router.push('/profile')}
                className="__chip"
              >
                <Avatar
                  src={workout.Workout.picture}
                  onClick={() => this.context.router.push('/profile')}
                />
                <span>{workout.Workout.nickname}</span>
              </Chip>
              <div className="__workout__title">
                <span> <b>{workout.title}</b> </span>
                <span>{workout.type}</span>
              </div>
              {workout.Workout.id === this.state.userId &&
                <div className="__workout__edit">
                  <i
                    className="fa fa-pencil"
                    onTouchTap={() => this.editWorkout(workout.id, index)}
                  />
                  <i
                    className="fa fa-trash"
                    onTouchTap={() =>
                      this.deleteWorkout(workout.id, workout.title, index)}
                  />
                </div>}
            </div>
            <div className="__workout__image__container">
              <img
                width="100%"
                src={workout.pictureURL}
                onTouchTap={() => this.handleWorkoutClick(workout)}
              />
              <div className="__workout__information">
                <div>
                  <span>
                    {moment(workout.startDateTime).format(
                      'ddd MMM Do, YYYY h:mm a'
                    )}
                    {' '}
                    -
                    {' '}
                    {moment(workout.endDateTime).format('LT')}
                  </span>
                  <br />
                  <span>{this.props.indexedParks[workout.parkId].title}</span>
                  <br />
                  {Boolean(RSVPCount) && <span>RSVPed: {RSVPCount}</span>}
                </div>
                <div>
                  <i
                    className="fa fa-share __share__icon"
                    onTouchTap={() =>
                      this.context.router.push(`/workout/${workout.slug}`)}
                  />
                </div>
              </div>
            </div>
            {workout.description &&
              <div className="__description_container">
                <div><b>Description</b></div>
                <div>{workout.description}</div>
              </div>}
            <div>{this.prepareRSVPButton(workout, index)}</div>
            <Snackbar
              open={this.state.snack}
              message={this.message}
              action="undo"
              autoHideDuration={this.state.autoHideDuration}
              onActionTouchTap={this.handleActionTouchTap.bind(this)}
              onRequestClose={this.handleRequestClose.bind(this)}
            />
          </CardText>
        </Paper>
      )
    })
  }

  componentDidUpdate () {
    if (this.clickedWorkout) {
      this.refWorkouts[this.clickedWorkout].scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      })

      delete this.clickedWorkout
    }
  }

  render () {
    return (
      <div className="__activities">
        {this.WorkoutList()}
      </div>
    )
  }
}

const styles = {
  button: {
    margin: 12,
  },
}

Activities.propTypes = {
  workouts: PropTypes.array.isRequired,
  indexedParks: PropTypes.object.isRequired,
  selectedWorkoutId: PropTypes.string,
  handleWorkoutClick: PropTypes.func.isRequired,

  // graphql props
  addRSVPForWorkout: PropTypes.func.isRequired,
  removeRSVPForWorkout: PropTypes.func.isRequired,
  deleteWorkout: PropTypes.func.isRequired,
}

Activities.contextTypes = {
  router: PropTypes.object.isRequired,
}

const ActivitiesWithData = compose(
  graphql(ADD_RSVP_FOR_WORKOUT, {
    props: ({ mutate }) => ({
      addRSVPForWorkout: input => mutate({ variables: { input: input } }),
    }),
  }),
  graphql(REMOVE_RSVP_FOR_WORKOUT, {
    props: ({ mutate }) => ({
      removeRSVPForWorkout: input => mutate({ variables: { input: input } }),
    }),
  }),
  graphql(DELETE_WORKOUT, {
    props: ({ mutate }) => ({
      deleteWorkout: input => mutate({ variables: { input: input } }),
    }),
  })
)(Activities)

export default ActivitiesWithData