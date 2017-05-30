import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import { GET_USER_WORKOUTS } from './gql'

import CircularProgress from 'material-ui/CircularProgress'

import ProfileHeader from './components/ProfileHeader'
import ProfileDetails from './components/ProfileDetails'
import WorkoutPost from 'Explore/components/WorkoutPost'

import './styles.css'

/* possible reference: https://github.com/scaphold-io/auth0-lock-playground */
class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editMode: false,
      userFieldsToUpdate: {},
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

  render () {
    const { data } = this.props
    const user = !data.loading ? data.getUser : null

    // const workoutRSVPs = !loading
    //   ? data.getUser.WorkoutRSVP.edges
    //   : []

    if (user) {
      return (
        <div className='home'>
          <ProfileHeader
            headerPhotoURL={user.headerPhotoURL}
            editMode={this.state.editMode}
            onProfileHeaderChange={(url) => this.setState({
              userFieldsToUpdate: { ...this.state.userFieldsToUpdate, headerPhotoURL: url },
            })}
          />
          <ProfileDetails
            user={user}
            editMode={this.state.editMode}
            onEnableEdit={(editMode) => this.setState({ editMode })}
            onSaveProfileChanges={(...args) => this.onSaveProfileChanges(...args)}
            onUserDescriptionChange={(description) => this.setState({
              userFieldsToUpdate: { ...this.state.userFieldsToUpdate, description },
            })}
            onUserNicknameChange={(nickname) => this.setState({
              userFieldsToUpdate: { ...this.state.userFieldsToUpdate, nickname },
            })}
            onProfilePhotoChange={(url) => this.setState({
              userFieldsToUpdate: { ...this.state.userFieldsToUpdate, picture: url },
            })}
          />
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
