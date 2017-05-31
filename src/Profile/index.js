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
    // workouts and workoutsRSVPs are non-extensible objects
    // need a solution to render RSVPs in order @Sal
    return (
      <div className='workouts'>
        {workouts.map((item, index) => (
          <div key={`calendar-workout-${index}`}>
            {!item || (<WorkoutPost data={item} />)}
            </div>
        ))}
        {workoutRSVPs.map((item, index) => (
          <div key={`calendar-workout-${index}`}>
            {!item || (<WorkoutPost data={item} />)}
            </div>
        ))}
      </div>
    )
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

    // const workoutRSVPs = !loading
    //   ? data.getUser.WorkoutRSVP.edges
    //   : []

    if (user) {
      console.log(data.getUser)
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
          <ProfileCalendarRow />
          <ProfileCalendarRow />
          <ProfileCalendarRow />
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
