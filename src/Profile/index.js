import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { GET_USER_WORKOUTS } from './gql'

import { Card, CardText } from 'material-ui/Card'
import { Tabs, Tab } from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'

import ProfileDetails from './components/Details'
import ProfileEdit from './components/Edit'

import WorkoutPost from 'Explore/components/WorkoutPost'

import './styles.css'

/* possible reference: https://github.com/scaphold-io/auth0-lock-playground */
class Profile extends React.Component {
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
  render () {
    console.log('Profile props', this.props)
    const { profile, data } = this.props
    const { loading } = this.props.data

    const workouts = !loading
      ? data.getUser.Workout.edges
      : []

    const workoutRSVPs = !loading
      ? data.getUser.WorkoutRSVP.edges
      : []

    return (
      <div className='home'>
        <Card>
          <CardText>
            <ProfileDetails profile={profile} />
            <ProfileEdit profile={profile} auth={this.props.auth} />
            <Tabs>
              <Tab label="Calendar">
                {workouts.length ? this.prepareCalendar(workouts, workoutRSVPs) : <CircularProgress size={8} />}
              </Tab>
            </Tabs>
          </CardText>
        </Card>
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
