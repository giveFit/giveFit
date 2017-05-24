import gql from 'graphql-tag'

export const RSVP_FOR_WORKOUT = gql`
mutation RSVPForWorkout($input: UpdateWorkoutInput!){
  updateWorkout(input:$input){
    changedWorkout{
      id
        Workout{
          nickname
          username
          WorkoutRSVP{
            edges {
              node {
              id
            }
          }
        }
      }
    }
  }
}
`
