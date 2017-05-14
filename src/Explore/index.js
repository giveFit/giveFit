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

    this.state = {
      profile: null,
      token: null,
      user: null,
      loggedInToolbar: false,
    }
  }

  render () {
    const { profile } = this.props

    return (
      <div>
        <GridContainer
          latLng={this.latLng}
          onPlaceSelect={(place) => {
            this.props.data.refetch({
              latLng: place.address,
            })

            return null
          }}
          profile={profile}
          user={this.state.user}
          workoutGroups={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []}
          workouts={(!this.props.data.loading && this.props.data.viewer.allWorkouts.edges) ? this.props.data.viewer.allWorkouts.edges : []}
          markers={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges)
            ? this.props.data.viewer.allWorkoutGroups.edges.map((i, index) => ({
              // title : i.node.title,
              position: {
                lat: parseFloat(i.node.lat),
                lng: parseFloat(i.node.lng),
              },
            }))
            : []
          }
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
