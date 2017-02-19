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
    const workouts=(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : [];
    //console.log('profile', profile);
    const listView = workouts.length ? <div className={styles.workouts}>
    {workouts.map((item, index) => (
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
          
            
                {listView}
            
          </Tab>
          <Tab label="Saved Groups" >
           <div>
             <div>
               <TextField hintText="Add a comment"/>
               <Comment />
             </div>
           </div>
          </Tab>
        </Tabs>
          
        </CardText>
        </Card>
      </div>
    )
  }
}

Home.contextTypes = {
  router: T.object
};

Home.propTypes = {
  auth: T.instanceOf(AuthService),
  updateUser: T.func.isRequired
};

const GET_THROUGH_VIEWER = gql`
  query GetThroughViewer($first: Int) {
    viewer {
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

const LOGIN_USER_WITH_AUTH0_LOCK = gql `
  mutation loginUserWithAuth0Lock($credential: LoginUserWithAuth0LockInput!) {
    loginUserWithAuth0Lock(input: $credential) {
    user{
      id
      username
    }
    }
  }
`
const UPDATE_USER_QUERY = gql`
mutation UpdateUser($user: UpdateUserInput!) {
  updateUser(input: $user) {
    changedUser {
      id
      username
      picture
    }
  }
}
`;
const HomeContainerWithData =  compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({
      variables: { first : FIRST }
    }),
  }),
  /*graphql(LOGGED_IN_USER, {
    props: ({ data }) =>  ({
      loggedInUser: data.viewer ? data.viewer.user : null
    })
  }),*/
  graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
    props: ({ mutate }) => ({
      loginUser: (credential) => mutate({ variables: { credential: credential } })
    })
  }),
  graphql(UPDATE_USER_QUERY, {
    props: ({ mutate }) => ({
      updateUser: (user) => mutate({ variables: { user: user }}),
    })
  })
)(Home);

export default HomeContainerWithData;
