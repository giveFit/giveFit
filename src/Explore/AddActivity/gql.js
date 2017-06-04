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
        _geoloc,
        slug,
        Workout{
          nickname,
          username,
          picture
        }
      }
    }
  }
`
