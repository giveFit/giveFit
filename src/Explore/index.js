import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import { GET_THROUGH_VIEWER } from './gql'
import GridContainer from './GridContainer'

import './styles.css'

class Explore extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.centerLatLng = null

    const { defaultLat, defaultLng } = this.props.route
    const { query } = this.props.location

    this.centerLatLng = {
      lat: query.lat ? parseFloat(query.lat) : defaultLat,
      lng: query.lng ? parseFloat(query.lng) : defaultLng,
    }
  }

  render () {
    console.log('explore props', this.props)
    const { profile, data } = this.props
    const { loading, viewer } = data
    let workoutGroups = []
    let workouts = []
    let user = null

    if (!loading) {
      workouts = viewer.allWorkouts.edges || []
      user = viewer.user
    }

    return (
      <div className='explore_container'>
        <GridContainer
          centerLatLng={this.centerLatLng}
          onPlaceSelect={(place) => {
            data.refetch({
              latLng: place.address,
            })
            return null
          }}
          profile={profile}
          workoutGroups={workoutGroups}
          workouts={workouts}
          user={user}
        />
      </div>
    )
  }
}

Explore.propTypes = {
  route: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object,
}

const ExploreWithData = compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({
      variables: {
        where: {
          endDateTime: {
            gte: new Date().toString(),
          },
        },
        orderBy: {
          field: 'startDateTime',
          direction: 'ASC',
        },
      },
    }),
  }),
)(Explore)

export default ExploreWithData
