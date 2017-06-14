// import ActivityContainer from './ActivityContainer'
// import { Tab, Tabs } from 'material-ui'
// import Groups from './Groups/ParkContainer'

import React from 'react'
import PropTypes from 'prop-types'
import foursquare from 'utils/foursquare'

import Activities from './Activities/index'
import MapContainer from './Map/index'
import AddActivity from './AddActivity/index'

class GridComponent extends React.Component {
  constructor (props) {
    super(props)

    this.googleMaps = window.google.maps

    if (!this.googleMaps) {
      console.error('Google map api was not found in the page.')
      return
    }

    this.state = {
      indexedParks: {},
      loadedMapData: false,
      openedParkId: '',
    }

    this.geocoder = new this.googleMaps.Geocoder()
  }

  componentDidMount () {
    this.fetchParks()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.workouts.length !== this.props.workouts.length) {
      this.fetchParks()
    }
  }

  /*
    Working on Google API for location fetching
    This google apis return the places in sets of 20, the maximum number of
    places that an api can fetch is 60. If you carefully observe the response of
    the google places api, it has a parameter called next_pagetoken.
    So the second time you hit the API u need to pass this next_pagetoken to
    fetch the next set of schools.@ChithriAjay
    how to do multiple types
    http://stackoverflow.com/questions/19625228/google-maps-api-multiple-keywords-in-place-searches
  */
  fetchParks () {
    const { centerLatLng, workouts } = this.props
    // is there a way to set this at a higher container component so as to pass it to
    // add-workout route depending on our city?
    console.log('centerLatLng', centerLatLng)

    const recreationCenters = foursquare.exploreVenues(centerLatLng, 'recreation center')
    const parks = foursquare.exploreVenues(centerLatLng, 'park')

    Promise.all([recreationCenters, parks])
      .then(([recCenters, parksResults]) => {
        const parksAndRecs = parksResults.concat(recCenters)

        // Build parks by ID object
        const indexedParks = {}

        // @todo: move this traversal to the utils files
        parksAndRecs.map((park) => {
          const parkVenue = park.venue

          // need to iterate over workouts, matching them to the place_id, adding
          // them as an array to the indexedParks
          const filteredWorkouts = workouts.filter((workout) => parkVenue.id === workout.node.parkId)

          indexedParks[parkVenue.id] = {
            parkId: parkVenue.id,
            title: parkVenue.name,
            position: {
              lat: parkVenue.location.lat,
              lng: parkVenue.location.lng,
            },
            photos: this.foursquareGetUrl(parkVenue.photos),
            vicinity: parkVenue.location.address,
            workouts: filteredWorkouts,
          }
        })

        this.setState({
          indexedParks,
          loadedMapData: true,
        })
      })
      .catch((err) => console.log(err))
  }

  // Url generator for foursquare
  foursquareGetUrl (photos) {
    var image = photos.groups && photos.groups[0] && photos.groups[0].items[0]
    // the original can be edited as required to get the required image dimensions
    // Read https://developer.foursquare.com/docs/responses/photo
    return image ? image.prefix + 'original' + image.suffix : null
  }

  setActiveMarker (parkId = '') {
    if (parkId === this.state.openedParkId) {
      parkId = ''
    }

    this.setState({
      openedParkId: parkId,
    })
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

  render () {
    const { centerLatLng, workouts, profile, onPlaceSelect, footerActiveTab } = this.props
    const { loadedMapData, indexedParks, openedParkId, selectedWorkoutId } = this.state

    return (
      <div className='__app__body__container'>
        <div className='__app__body__container__left'>
          {loadedMapData &&
            <MapContainer
              mapCenter={centerLatLng}
              workouts={workouts}
              indexedParks={indexedParks}
              openedParkId={openedParkId}
              geocoder={this.geocoder}
              onMarkerClick={(parkId) => this.setActiveMarker(parkId)}
              onPlaceSelect={onPlaceSelect}
              footerActiveTab={footerActiveTab}
            />
          }
          {/* this.state.openedParkId &&
            <ActivityContainer
              indexedParks={indexedParks}
              openedParkId={this.state.openedParkId}
              parkTitle={indexedParks[this.state.openedParkId].googleData.title}
              workouts={indexedParks[this.state.openedParkId].googleData.workouts}
              closeActivity={() => this.setActiveMarker()}
            /> */}
        </div>

        {loadedMapData &&
          <div className='__grid__list' >
            {/* <Tabs className='__tabs__container'>
              <Tab label='Activities'> */}
                <AddActivity
                  indexedParks={indexedParks}
                  profile={profile}
                  workouts={workouts}
                  data={this.props.data}
                />
                <Activities
                  workouts={indexedParks[openedParkId] ? indexedParks[openedParkId].workouts : workouts}
                  indexedParks={indexedParks}
                  profile={profile}
                  selectedWorkoutId={selectedWorkoutId}
                  handleWorkoutClick={(parkId, workoutId) => this.handleWorkoutClick(parkId, workoutId)}
                />
              {/* </Tab> */}
              {/* <Tab label='Locations'>
                <AddActivity indexedParks={indexedParks} />
                <Groups
                  placeById={indexedParks}
                  profile={profile}
                  onFeedItemClick={(parkId) => this.setActiveMarker(parkId)}
                />
              </Tab>
            </Tabs> */}
          </div>
        }
      </div>
    )
  }
}

GridComponent.propTypes = {
  centerLatLng: PropTypes.object.isRequired,
  workouts: PropTypes.array.isRequired,
  workoutGroups: PropTypes.array.isRequired,
  profile: PropTypes.object,
  onPlaceSelect: PropTypes.func.isRequired,
  footerActiveTab: PropTypes.string.isRequired,
  data: PropTypes.object,
}

export default GridComponent
