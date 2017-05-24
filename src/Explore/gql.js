import gql from 'graphql-tag'

export const GET_THROUGH_VIEWER = gql`
query GetThroughViewer($where:WorkoutWhereArgs, $orderBy:[WorkoutOrderByArgs!]) {
    viewer{
      user{
        id
      }
      allWorkouts(where:$where, orderBy:$orderBy){
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
          }
        }
      }
    }
  }
`
