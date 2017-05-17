import React from 'react'
import PropTypes from 'prop-types'

// import { Tab, Tabs } from 'material-ui'

import axios from 'axios'

// import Groups from './Groups/ParkContainer'
import Activities from './Activities/'

// import ActivityContainer from './ActivityContainer'
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

    // Foursquare api calls
    // Explore: https://developer.foursquare.com/docs/venues/explore
    const foursquare = (query) => {
      return axios.get('https://api.foursquare.com/v2/venues/explore', {
        params: {
          client_id: process.env.FOURSQUARE_CLIENT_ID_KEY,
          client_secret: process.env.FOURSQUARE_CLIENT_SECRET_KEY,
          ll: centerLatLng.lat.toString().concat(',' + centerLatLng.lng.toString()),
          radius: 5000,
          venuePhotos: 1,
          query,
          m: 'foursquare',
          locale: 'en',
          v: '20140806',
        },
      })
        .then(({ data }) => data.response.groups[0].items)
    }

    Promise.all([foursquare('recreation center'), foursquare('park')])
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

  handleWorkoutClick (parkId) {
    this.setState({
      openedParkId: parkId,
    })
  }

  render () {
    const { centerLatLng, workouts, profile, onPlaceSelect } = this.props
    const { loadedMapData, indexedParks, openedParkId } = this.state

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
            />
          }
          {/*this.state.openedParkId &&
            <ActivityContainer
              indexedParks={indexedParks}
              openedParkId={this.state.openedParkId}
              parkTitle={indexedParks[this.state.openedParkId].googleData.title}
              workouts={indexedParks[this.state.openedParkId].googleData.workouts}
              closeActivity={() => this.setActiveMarker()}
            />*/}
        </div>

        {loadedMapData &&
          <div className='__grid__list' >
            {/*<Tabs className='__tabs__container'>
              <Tab label='Activities'>*/}
                <AddActivity
                  indexedParks={indexedParks}
                  profile={profile}
                  workouts={workouts}
                />
                <Activities
                  workouts={indexedParks[openedParkId] ? indexedParks[openedParkId].workouts : workouts}
                  indexedParks={indexedParks}
                  handleWorkoutClick={(parkId) => this.handleWorkoutClick(parkId)}
                />
              {/*</Tab>*/}
              {/*<Tab label='Locations'>
                <AddActivity indexedParks={indexedParks} />
                <Groups
                  placeById={indexedParks}
                  profile={profile}
                  onFeedItemClick={(parkId) => this.setActiveMarker(parkId)}
                />
              </Tab>
            </Tabs>*/}
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
  profile: PropTypes.object.isRequired,
  onPlaceSelect: PropTypes.func.isRequired,
}

export default GridComponent
