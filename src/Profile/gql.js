import gql from 'graphql-tag'

export const GET_USER_WORKOUTS = gql`
query GetUserWorkouts($first: Int, $where: WorkoutWhereArgs!, $orderBy: [WorkoutOrderByArgs!]) {
  viewer {
    user {
      WorkoutRSVP(first: $first, where: $where, orderBy: $orderBy){
        edges{
          node{
            id
            parkId
            title
            description
            startDateTime
            endDateTime
          }
        }          
      }
      Workout(first: $first, where: $where, orderBy: $orderBy) {
        edges {
          node {
            id
            parkId
            title
            description
            startDateTime
            endDateTime
            Workout {
              nickname
              username
              picture
              __typename
            }
            
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`
