import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'

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
    this.state = {
      workouts: [],
      indexedParks: {},
      loadedMapData: false,
      openedParkId: '',
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.loading && !this.state.workouts.length) {
      this.setState({
        workouts: nextProps.viewer.allWorkouts.edges,
      })
    }
  }

  render () {
    const { profile, footerActiveTab, data } = this.props

    return (
      <div>
        { this.props.loading && !this.state.workouts.length
          ? <div> Loading... </div>
          : <div className='explore_container'>
            <GridContainer
              centerLatLng={this.centerLatLng}
              onPlaceSelect={(place) => {
                data.refetch({
                  latLng: place.address,
                })
                return null
              }}
              profile={profile}
              workouts={this.state.workouts}
              footerActiveTab={footerActiveTab}
              handleWorkoutClick={this.handleWorkoutClick.bind(this)}
              setActiveMarker={this.setActiveMarker.bind(this)}
              setParks={this.setParks.bind(this)}
              indexedParks={this.state.indexedParks}
              loadedMapData={this.state.loadedMapData}
              openedParkId={this.state.openedParkId}
              selectedWorkoutId={this.state.selectedWorkoutId}
            />
          </div>
        }
      </div>
    )
  }

  handleWorkoutClick (parkId, workoutId) {
    if (workoutId === this.state.selectedWorkoutId) {
      workoutId = ''
      parkId = ''
    }

    this.setState({
      openedParkId: parkId,
      selectedWorkoutId: workoutId,
    })
  }

  setActiveMarker (parkId = '') {
    if (parkId === this.state.openedParkId) {
      parkId = ''
    }

    this.setState({
      openedParkId: parkId,
      selectedWorkoutId: '',
    })

    this.props.onTabChange('list')
  }

  setParks (indexedParks) {
    this.setState({
      indexedParks,
      loadedMapData: true,
    })
  }
}

Explore.propTypes = {
  route: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object,
  footerActiveTab: PropTypes.string.isRequired,
  viewer: PropTypes.object,
  loading: PropTypes.bool,
  data: PropTypes.object,
  onTabChange: PropTypes.func.isRequired,
}

// for recurring workouts, create microservice that creates a
// number of workouts corresponding to each number of times requested
const withData = graphql(GET_THROUGH_VIEWER, {
  options: ({ params }) => ({
    variables: {
      first: 100,
      where: {
        endDateTime: {
          gte: new Date().toString(),
        },
      },
    },
  }),
  props: ({ data: { viewer, loading } }) => ({
    viewer, loading,
  }),
})

const ExploreWithData = withData(Explore)

export default ExploreWithData
