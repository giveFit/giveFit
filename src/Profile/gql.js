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
              id
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
            Workout {
              id
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

export const UPDATE_USER_QUERY = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(input: $user) {
      changedUser {
        headerPhotoURL
        description
        nickname
        picture
      }
    }
  }
`

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
