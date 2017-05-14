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
  prepareCalendar (workouts) {
    return (
      <div className='workouts'>
        {workouts.map((item, index) => (
          <div key={`calendar-workout-${index}`}>
            {!item || (<WorkoutPost data={item} />)}
            </div>
        ))}
      </div>
    )
  }
  render () {
    const { profile } = this.props
    const { loading, viewer } = this.props.data

    const workouts = !loading && viewer.user.Workout.edges
      ? viewer.user.Workout.edges
      : []

    return (
      <div className='home'>
        <Card>
          <CardText>
            <p>Welcome, {profile.username}!</p>
            <ProfileDetails profile={profile} />
            <ProfileEdit profile={profile} auth={this.props.auth} />
            <Tabs>
              <Tab label="Calendar">
                {workouts.length ? this.prepareCalendar(workouts) : <CircularProgress size={8} />}
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
        first: 10,
        where: {
          endDateTime: {
            gte: new Date().toString()
          }
        },
        orderBy: {
          field: 'startDateTime',
          direction: 'ASC',
        },
      },
    }),
  })
)(Profile)

export default ProfileWithData
