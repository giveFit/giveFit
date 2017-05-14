import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import { GET_THROUGH_VIEWER } from './gql'

import GridContainer from './GridContainer'

import './styles.css'

class Explore extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.latLng = null

    const { query } = this.props.location

    if (query.lat && query.lng) {
      this.latLng = {
        lat: parseFloat(query.lat),
        lng: parseFloat(query.lng),
      }
    }
  }

  render () {
    const { profile, data } = this.props
    const { loading, viewer } = data
    let workoutGroups = []
    let workouts = []

    if (!loading) {
      workouts = viewer.allworkouts || []
      workoutGroups = viewer.allWorkoutGroups || []
    }

    return (
      <div>
        <GridContainer
          latLng={this.latLng}
          onPlaceSelect={(place) => {
            data.refetch({
              latLng: place.address,
            })

            return null
          }}
          profile={profile}
          workoutGroups={workoutGroups}
          workouts={workouts}
          markers={workoutGroups.map((workout) => ({
            // title : workout.node.title,
            position: {
              lat: parseFloat(workout.node.lat),
              lng: parseFloat(workout.node.lng),
            },
          }))}
        />
      </div>
    )
  }
}

Explore.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
}

const ExploreWithData = compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({
      variables: { first: 8 },
    }),
  })
)(Explore)

export default ExploreWithData
