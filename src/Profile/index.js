import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { graphql, compose } from 'react-apollo'

import { GET_USER_WORKOUTS } from './gql'

import ProfileHeader from './components/ProfileHeader'
import ProfileDetails from './components/ProfileDetails'
import ProfileCalendarBar from './components/ProfileCalendarBar'
import ProfileCalendarRow from './components/ProfileCalendarRow'

import WorkoutPost from 'Explore/components/WorkoutPost'

import './styles.css'

/* possible reference: https://github.com/scaphold-io/auth0-lock-playground */
class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      userFieldsToUpdate: {},
      todaysDate: moment(),
    }
  }

  prepareCalendar (workouts, workoutRSVPs) {
    const calendar = {}

    for (let i = 0; i < workouts.length; i++) {
      const workout = workouts[i].node

      calendar[workout.parkId] = calendar[workout.parkId]
        ? calendar[workout.parkId].concat([workout])
        : [workout]
    }

    for (let i = 0; i < workoutRSVPs.length; i++) {
      const workout = Object.assign({}, workoutRSVPs[i].node)

      workout.rsvp = true

      calendar[workout.parkId] = calendar[workout.parkId]
        ? calendar[workout.parkId].concat([workout])
        : [workout]
    }

    const calendarKeys = Object.keys(calendar)

    return calendarKeys.map((key, index) => {
      const workouts = calendarKeys[key]

      return (
        <ProfileCalendarRow
          key={`parkId-${key}`}
          parkId={key}
          workouts={workouts}
        />
      )
    })
  }

  onSaveProfileChanges () {
    this.setState({
      editMode: false,
    })
  }

  userFieldsToUpdate (fieldName, value) {
    this.setState({
      userFieldsToUpdate: { ...this.state.userFieldsToUpdate, [fieldName]: value },
    })
  }

  previousWeek () {
    const previousWeek = moment(this.state.todaysDate).day(-7)

    if (previousWeek.valueOf() - moment().valueOf() >= 0) {
      this.setState({
        todaysDate: moment(this.state.todaysDate).day(-7),
      })
    } else {
      this.setState({
        todaysDate: moment(),
      })
    }
  }

  nextWeek () {
    this.setState({
      todaysDate: moment(this.state.todaysDate).day(7),
    })
  }

  render () {
    const { data } = this.props
    const user = !data.loading ? data.getUser : null
    const userWorkoutRSVPs = !data.loading ? data.getUser.WorkoutRSVP.edges : []
    const userWorkouts = !data.loading ? data.getUser.Workout.edges : []

    if (user) {
      return (
        <div className='home'>
          <ProfileHeader
            headerPhotoURL={user.headerPhotoURL}
            editMode={this.state.editMode}
            onProfileHeaderChange={(url) => this.userFieldsToUpdate('headerPhotoURL', url)}
          />
          <ProfileDetails
            user={user}
            editMode={this.state.editMode}
            onEnableEdit={(editMode) => this.setState({ editMode })}
            onSaveProfileChanges={(...args) => this.onSaveProfileChanges(...args)}
            onUserDescriptionChange={(description) => this.userFieldsToUpdate('description', description)}
            onUserNicknameChange={(nickname) => this.userFieldsToUpdate('nickname', nickname)}
            onProfilePhotoChange={(url) => this.userFieldsToUpdate('picture', url)}
          />
          <ProfileCalendarBar
            todaysDate={this.state.todaysDate}
            previousWeek={() => this.previousWeek()}
            nextWeek={() => this.nextWeek()}
          />
          {this.prepareCalendar(userWorkouts, userWorkoutRSVPs)}
        </div>
      )
    }

    return (
      <div className='home'>
        <div>You are not logged in</div>
      </div>
    )
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
}

const ProfileWithData = compose(
  graphql(GET_USER_WORKOUTS, {
    options: (props) => ({
      variables: {
        id: JSON.parse(window.localStorage.getItem('scapholdUserId')),
        first: 10,
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
    }),
  }),
)(Profile)

export default ProfileWithData
