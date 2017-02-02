import React, { PropTypes as T } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import AuthService from 'utils/AuthService';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {Card, CardActions, CardMedia, CardHeader, CardText} from 'material-ui/Card';

import styles from './styles.module.css';

import ProfileDetails from '../Profile/ProfileDetails';
import ProfileEdit from '../Profile/ProfileEdit';
import LoggedInToolbar from '../Header/LoggedInToolbar'
import apolloConfig from '../../../../apolloConfig';

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
    return (
      <div className={styles.root}>
        <Card>
        <CardText>
          <p>Welcome, {profile.given_name}!</p>
          <ProfileDetails profile={profile}></ProfileDetails>
          <ProfileEdit profile={profile} auth={this.props.auth}></ProfileEdit>
          <RaisedButton onClick={this.logout.bind(this)}>Logout</RaisedButton>
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
  register: T.func.isRequired
};

const LOGIN_USER_WITH_AUTH0_LOCK = gql `
  mutation loginUserWithAuth0Lock($data: LoginUserWithAuth0LockInput!) {
    loginUserWithAuth0Lock(input: $data) {
    user{
      id
      username
    }
    }
  }
`
const HomeContainerWithData = graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
  props: ({ mutate }) => ({
    register: (data) => mutate({
      variables: {
        data
      }
    }),
  }),
})(Home);

export default HomeContainerWithData;
