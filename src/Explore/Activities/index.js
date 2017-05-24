import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import { CardText, Chip, Avatar, Snackbar } from 'material-ui'

import { RSVP_FOR_WORKOUT } from 'gql.js'

import './styles.css'

class Activities extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      snack: false,
      autoHideDuration: 2000,
      messageTrue: 'Event added to your calendar',
      messageFalse: 'Event removed from your calendar',
    }
  }

  handleRequestClose () {
    this.setState({snack: false})
  }

  handleSnack () {
    this.setState({snack: !this.state.snack})
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

        if (!this.props.indexedParks[workout.parkId]) {
          return null
        }

        return (
          <CardText key={`workout-${index}`} onClick={() => this.props.handleWorkoutClick(workout.parkId)}>
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
                <span><b>Exercise Title:</b> {workout.title}</span>
                <span><b>Exercise Type:</b> {workout.type}</span>
              </div>
            </div>
            <div className='__workout__image__container'>
              <img
                width='100%'
                height='300'
                src={workout.pictureURL}
              />
              <div className='__workout__information'>
                <div>
                  {moment(workout.startDateTime).format('ddd MMM Do, YYYY h:mm a')} - {moment(workout.endDateTime).format('LT')}
                  <br />
                  <b>Location: </b>{this.props.indexedParks[workout.parkId].title}
                </div>
                <div>
                  <i
                    className='fa fa-check-circle-o __share__icon'
                    onTouchTap={this.handleSnack.bind(this)}
                  />
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
                message={this.state.messageTrue}
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
  workouts: PropTypes.array.isRequired,
  handleWorkoutClick: PropTypes.func.isRequired,
}

const ActivitiesWithData = compose(
  graphql(RSVP_FOR_WORKOUT, {
    props: ({ mutate }) => ({
      
    })
  }),
  graphql(RSVP_FOR_WORKOUT, {
    props: ({ mutate }) => ({
      createWorkout: (input) => mutate({ variables: { input: input } }),
    }),
  }),
)(Activities)

export default ActivitiesWithData
