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
