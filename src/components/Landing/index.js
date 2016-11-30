import React, { PropTypes as T } from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AuthService from 'utils/AuthService';
import TextField from 'material-ui/TextField';

export class LandingPage extends React.Component {
  render(){
    return<Card>
          <CardMedia
           overlay={<CardTitle title="Givefit" subtitle="Find your free fitness community" />}
         >
           <img src="https://images.unsplash.com/photo-1446770145316-10a05382c470?dpr=1&auto=format&fit=crop&w=767&h=508&q=80&cs=tinysrgb&crop=" />
         </CardMedia>
      <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
    <CardText>
    <TextField
     hintText="Start typing here.."
     floatingLabelText="Search for Workouts"
   /><br />
  </CardText>
  </Card>
  }
}

LandingPage.contextTypes = {
  router: T.object
};

LandingPage.propTypes = {
  auth: T.instanceOf(AuthService),
  register: T.func.isRequired
};

const LOGIN_USER_WITH_AUTH0_LOCK = gql `
  mutation loginUserWithAuth0Lock($data: LoginUserWithAuth0LockInput!) {
    loginUserWithAuth0Lock(input: $data) {
    token
    user{
      id
      username
    }
    }
  }
`
const LandingPageContainerWithData = graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
  props: ({ mutate }) => ({
    register: (data) => mutate({
      variables: {
        data
      }
    }),
  }),
})(LandingPage);

export default LandingPageContainerWithData;
