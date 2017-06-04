import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { graphql, compose } from 'react-apollo'

import foursquare from 'utils/foursquare'
import { GET_USER_WORKOUTS } from './gql'

import ProfileHeader from './components/ProfileHeader'
import ProfileDetails from './components/ProfileDetails'
import ProfileCalendarBar from './components/ProfileCalendarBar'
import ProfileCalendarRow from './components/ProfileCalendarRow'

import './styles.css'

/* possible reference: https://github.com/scaphold-io/auth0-lock-playground */
class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      userFieldsToUpdate: {},
      todaysDate: moment(),
      user: null,
      calendar: null,
    }
  }

  componentWillReceiveProps (nextProps) {
    const { data } = nextProps

    if (this.props.data.loading !== data.loading) {
      const calendar = {}
      const userWorkouts = data.getUser.Workout.edges
      const userWorkoutRSVPs = data.getUser.WorkoutRSVP.edges

      for (let i = 0; i < userWorkouts.length; i++) {
        const workout = userWorkouts[i].node

        if (!calendar[workout.parkId]) {
          calendar[workout.parkId] = { workouts: [] }
        }

        calendar[workout.parkId].workouts.push(workout)
      }

      for (let i = 0; i < userWorkoutRSVPs.length; i++) {
        const workout = Object.assign({}, userWorkoutRSVPs[i].node)

        workout.rsvp = true

        if (!calendar[workout.parkId]) {
          calendar[workout.parkId] = { workouts: [] }
        }

        calendar[workout.parkId].workouts.push(workout)
      }

      const calendarKeys = Object.keys(calendar)

      Promise.all(calendarKeys.map((key) => {
        return foursquare.getVenueInfoById(key)
          .then((venueInfo) => {
            calendar[key].title = venueInfo.name
            calendar[key].location = venueInfo.location
          })
      }))
        .then(() => {
          this.setState({
            user: data.getUser,
            calendar,
          })
        })
        .catch((err) => console.log(err))
    }
  }

  prepareCalendar () {
    const { calendar } = this.state
    const calendarKeys = Object.keys(calendar)

    if (!calendarKeys.length) {
      return (
        <div className='no-workouts'>You have no Workouts scheduled or RSVP'd to.</div>
      )
    }

    return calendarKeys.map((key, index) => {
      const park = calendar[key]

      return (
        <ProfileCalendarRow
          key={`parkId-${key}`}
          parkTitle={park.title}
          parkLocation={park.location.address}
          workouts={park.workouts}
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
    const { user, editMode, todaysDate } = this.state

    if (user) {
      return (
        <div className='home'>
          <ProfileHeader
            headerPhotoURL={user.headerPhotoURL}
            editMode={editMode}
            onProfileHeaderChange={(url) => this.userFieldsToUpdate('headerPhotoURL', url)}
          />
          <ProfileDetails
            user={user}
            editMode={editMode}
            onEnableEdit={(editMode) => this.setState({ editMode })}
            onSaveProfileChanges={(...args) => this.onSaveProfileChanges(...args)}
            onUserDescriptionChange={(description) => this.userFieldsToUpdate('description', description)}
            onUserNicknameChange={(nickname) => this.userFieldsToUpdate('nickname', nickname)}
            onProfilePhotoChange={(url) => this.userFieldsToUpdate('picture', url)}
          />
          <ProfileCalendarBar
            todaysDate={todaysDate}
            previousWeek={() => this.previousWeek()}
            nextWeek={() => this.nextWeek()}
          />
          {this.prepareCalendar()}
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
