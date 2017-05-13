import gql from 'graphql-tag'

export const GET_USER_WORKOUTS = gql`
  query GetUserWorkouts($first: Int, $where: WorkoutWhereArgs!, $orderBy:[WorkoutOrderByArgs!]){
    viewer{
      user{
        Workout(first:$first, where: $where, orderBy: $orderBy){
         edges{
          node{
            id
            parkId
            title
            description
            startDateTime
            endDateTime
            Workout{
              nickname
              username
              picture
            }
          }
        }
        }
      }
    }
  }
`
