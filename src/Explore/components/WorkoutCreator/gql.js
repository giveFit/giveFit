import gql from 'graphql-tag'

export const CREATE_WORKOUT = gql`
  mutation CreateWorkout($input: CreateWorkoutInput!) {
    createWorkout(input: $input){
      changedWorkout{
        title,
        type,
        startDateTime,
        endDateTime,
        description,
        requestTrainer,
        parkId,
        pictureURL,
        userEmail,
        Workout{
          nickname,
          username,
          picture
        }
      }
    }
  }
`

export const LOGGEDIN_USER_QUERY = gql`
  query LoggedInUser{
    viewer{
      user{
        id
        username
        nickname
      }
    }
  }
`
