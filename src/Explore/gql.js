import gql from 'graphql-tag'

export const GET_THROUGH_VIEWER = gql`
  query GetThroughViewer{
  viewer {
    allWorkouts {
      edges {
        node {
          id
          parkId
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
