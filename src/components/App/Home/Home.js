import React, { PropTypes as T } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import AuthService from 'utils/AuthService';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import {Card, CardActions, CardMedia, CardHeader, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import styles from './styles.module.css';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import Comment from 'material-ui/svg-icons/communication/comment';

//local
import ProfileDetails from '../Profile/ProfileDetails';
import ProfileEdit from '../Profile/ProfileEdit';
import LoggedInToolbar from '../Header/LoggedInToolbar'
import apolloConfig from '../../../../apolloConfig';
import HomeFeed from '../Landing/SubComponents/HomeFeed'

/*possible reference: https://github.com/scaphold-io/auth0-lock-playground*/
export class Home extends React.Component {
  constructor(props, context, state) {
    console.log('profile props', props)
    console.log('profile context', context)
    console.log('profile state', state)
    super(props, context)
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
  }

  logout(){
    console.log('did the logout')
    this.props.route.auth.logout()
    this.context.router.push('/');
  }
  render(){
    const profile = this.auth.getProfile();
    const workoutGroups=(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : [];
    const workouts=(!this.props.data.loading && this.props.data.viewer.allWorkouts.edges) ? this.props.data.viewer.allWorkouts.edges : [];
    //console.log('profile', profile);
    const calendar = workoutGroups.length ? <div className={styles.workouts}>
    {workoutGroups.map((item, index) => (
         <div key={index} className={styles.workout}> {!item ||
          (<HomeFeed
            data={item.node}
         />)} </div>
    ))}
    </div> : <CircularProgress size={80} />
    const savedGroups = workoutGroups.length ? <div className={styles.workouts}>
    {workoutGroups.map((item, index) => (
         <div key={index} className={styles.workout}> {!item ||
          (<HomeFeed
            data={item.node}
         />)} </div>
    ))}
    </div> : <CircularProgress size={80} />
    return (
      <div className={styles.root}>
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
          <Tab label="My Tribes" >
           
           {savedGroups}

          </Tab>
        </Tabs>
          
        </CardText>
        </Card>
      </div>
    )
  }
}


const GET_THROUGH_VIEWER = gql`
query GetThroughViewer($first: Int) {
    viewer {
    allWorkouts {
        edges {
            node {
                parkId,
                title,
                date,
                time,
                description,
                recurring,
                Workout{
                  nickname
                  username
                  picture
              }
          }
        }
      }
      allWorkoutGroups(first: $first) {
        edges {
          node {
          id
          image
          title
          lat
          lng
          avatar
          contentSnippet
          }
        }
      }
    }
}
`;

//How many WorkoutGroups to return
const FIRST = 8;


const HomeContainerWithData =  compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({
      variables: { first : FIRST }
    }),
  })
)(Home);

export default HomeContainerWithData;
