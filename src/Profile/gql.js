import gql from 'graphql-tag'

export const GET_USER_WORKOUTS = gql`
query GetUserWorkouts($id:ID!, $first: Int, $where: WorkoutWhereArgs!, $orderBy: [WorkoutOrderByArgs!]) {
    getUser(id:$id) {
      id,
      headerPhotoURL,
      description,
      picture,
      nickname,
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
            }
          }
        }
      }
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
  }
}
`
