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

export const DELETE_WORKOUT = gql`
  mutation deleteWorkout($input: DeleteWorkoutInput!){
    deleteWorkout (input: $input) {
      viewer {
        id
      }
    }
  }
`

// @todo: this needs to be tested
export const UPDATE_WORKOUT = gql`
  mutation updateWorkout($input: UpdateWorkoutInput!){
    updateWorkout (input: $input) {
      changedWorkout {
        id
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
      }
    }
  }
`
