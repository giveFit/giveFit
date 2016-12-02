import React, { PropTypes as T } from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AuthService from 'utils/AuthService';

export class LandingPage extends React.Component {
  render(){
    return<Card>
      <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
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
