import React from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import AuthService from 'utils/AuthService'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import {Card, CardActions, CardMedia, CardHeader, CardText} from 'material-ui/Card'
import {Tabs, Tab} from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'
import TextField from 'material-ui/TextField'
import Comment from 'material-ui/svg-icons/communication/comment'

// local
import ProfileDetails from '../Profile/ProfileDetails'
import ProfileEdit from '../Profile/ProfileEdit'
import LoggedInToolbar from '../Header/LoggedInToolbar'
import apolloConfig from '../../../../apolloConfig'
import HomeFeed from '../Landing/SubComponents/HomeFeed'
import WorkoutPost from '../Feed/subComponents/WorkoutPost'

import './styles.css'

/* possible reference: https://github.com/scaphold-io/auth0-lock-playground */
export class Home extends React.Component {
  constructor (props, context, state) {
    console.log('profile props', props)
    console.log('profile context', context)
    console.log('profile state', state)
    super(props, context)
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain)
  }

  logout () {
    console.log('did the logout')
    this.props.route.auth.logout()
    this.context.router.push('/')
  }

  render () {
    const profile = this.auth.getProfile()
    const workouts = (!this.props.data.loading && this.props.data.viewer.user.Workout.edges) ? this.props.data.viewer.user.Workout.edges : []
    // console.log('profile', profile);
    const calendar = workouts.length ? <div className='workouts'>
    {workouts.map((item, index) => (
         <div key={index}> {!item ||
          (<WorkoutPost
            data={item}
         />)} </div>
    ))}
    </div> : <CircularProgress size={80} />
    return (
      <div className='root'>
        <LoggedInToolbar
            auth={this.props}
            profile={profile}
          />
        <Card>
        <CardText>
          <p>Welcome, {profile.given_name}!</p>
          <ProfileDetails profile={profile}></ProfileDetails>
          <ProfileEdit profile={profile} auth={this.props.auth}></ProfileEdit>
          <Tabs>
            <Tab label="Calendar">
              {calendar}
            </Tab>
        </Tabs>
        </CardText>
        </Card>
      </div>
    )
  }
}

const GET_USER_WORKOUTS = gql`
query GetUserWorkouts($first: Int, $where: WorkoutWhereArgs!, $orderBy:[WorkoutOrderByArgs!]){
  viewer{
    user{
      Workout(first:$first, where: $where, orderBy: $orderBy){
       edges{
        node{
          id
          parkId
          title
          description
          startDateTime
          endDateTime
          Workout{
            nickname
            username
            picture
          }
        }
      } 
      }
    }
  }
}
`
const FIRST = 10

var today = new Date().toString()

const WHERE = {
  'endDateTime': {
    'gte': today,
  },
}

const ORDERBY = {
  'field': 'startDateTime',
  'direction': 'ASC',
}

const HomeContainerWithData = compose(
  graphql(GET_USER_WORKOUTS, {
    options: (props) => ({
      variables: {first: FIRST, where: WHERE, orderBy: ORDERBY},
    }),
  })
)(Home)

export default HomeContainerWithData
