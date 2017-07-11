import gql from 'graphql-tag'

export const ADD_RSVP_FOR_WORKOUT = gql`
  mutation addRSVPForWorkout($input: AddToRsvpsConnectionInput!){
    addToRsvpsConnection (input: $input) {
      viewer {
        id
      }
    }
  }
`

export const REMOVE_RSVP_FOR_WORKOUT = gql`
  mutation removeRSVPForWorkout($input: RemoveFromRsvpsConnectionInput!){
    removeFromRsvpsConnection (input: $input) {
      viewer {
        id
      }
    }
  }
`
export const GET_THROUGH_VIEWER = gql`
query GetThroughViewer($first: Int, $where:WorkoutWhereArgs, $orderBy:[WorkoutOrderByArgs]) {
    viewer{
      allWorkouts(first: $first, where:$where, orderBy:$orderBy){
        edges {
          node {
            id
            parkId
            startDateTime
            title
            description
            pictureURL
            startDateTime
            endDateTime
            requestTrainer
            recurring
            type
            Workout {
              nickname
              username
              picture
            }
            RSVPsForWorkout{
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
  }
`
