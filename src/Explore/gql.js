import gql from 'graphql-tag'

export const GET_THROUGH_VIEWER = gql`
  query GetThroughViewer($first: Int) {
    viewer {
      allWorkouts {
        edges {
          node {
            id
            parkId
            title
            description
            Workout {
              nickname
              username
              picture
            }
          }
        }
      }
      allWorkoutGroups(first: $first) {
        edges {
          node {
            id
            image
            title
            lat
            lng
            avatar
            contentSnippet
          }
        }
      }
    }
  }
`
