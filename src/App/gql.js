import gql from 'graphql-tag'

export const LOGIN_USER_WITH_AUTH0_LOCK = gql`
  mutation loginUserWithAuth0Lock($credential: LoginUserWithAuth0LockInput!) {
    loginUserWithAuth0Lock(input: $credential) {
    user{
      id
      username
    }
    }
  }
`
export const UPDATE_USER_QUERY = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(input: $user) {
      changedUser {
        id
        username
        picture
      }
    }
  }
`