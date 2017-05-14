import React from 'react'
import PropTypes from 'prop-types'

import { Tab, Tabs } from 'material-ui'

import foursquare from 'utils/foursquareApi'

import ParkContainer from './Feed/ParkContainer'
import ActivityContainer from './ActivityContainer'
import MapContainer from './Map/index'
import WorkoutCreator from './components/WorkoutCreator/index'

import './GridContainer.css'

class GridComponent extends React.Component {
  constructor (props) {
    super(props)

    this.googleMaps = window.google.maps

    if (!this.googleMaps) {
      console.error('Google map api was not found in the page.')
      return
    }

    this.state = {
      parks: [],
      parksAndGyms: [],
      loadedMapData: false,
      activeIndex: -1,
      openedActivity: '',
    }

    this.geocoder = new this.googleMaps.Geocoder()
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
  componentDidMount () {
    const { centerLatLng } = this.props

    // Note : This concatination logic can be moved to foursquareApi.js to keep it consistent with googleApi
    // FourSquare category tree: https://developer.foursquare.com/categorytree
    const recCenters = {
      ll: centerLatLng.lat.toString().concat(',' + centerLatLng.lng.toString()),
      radius: 5000,
      query: 'recreation center',
      venuePhotos: 1,
    }
    const parks = {
      ll: centerLatLng.lat.toString().concat(',' + centerLatLng.lng.toString()),
      radius: 5000,
      query: 'park',
      venuePhotos: 1,
    }

    try {
      // Foursquare api calls
      // Explore: https://developer.foursquare.com/docs/venues/explore
      const recCentersPromise = foursquare.venues.explore(recCenters)
      const parksPromise = foursquare.venues.explore(parks)

      Promise.all([parksPromise, recCentersPromise])
        .then(([recCentersResult, parksResult]) => {
          const recCenterItems = recCentersResult.response.groups[0].items
          const parksResultItems = parksResult.response.groups[0].items

          this.setState({
            // NOTE: move this traversal to the utils files
            parks: parksResultItems,
            parksAndGyms: parksResultItems.concat(recCenterItems),
            loadedMapData: true,
          })
        })
    } catch (err) {
      console.log(err)
    }
  }

  toggleActivity (parkID = '', index) {
    if (parkID === this.state.openedActivity) {
      parkID = ''
    }

    this.setState({ openedActivity: parkID })
  }

  setActiveIndex (index, parkID = '') {
    if (parkID === this.state.openedActivity) {
      parkID = ''
    }

    var activeIndex = index === undefined ? -1 : index

    this.setState({ openedActivity: parkID,
      activeIndex,
    })
  }

  // Url generator for foursquare
  foursquareGetUrl (photos) {
    var image = photos.groups && photos.groups[0] && photos.groups[0].items[0]
    // the original can be edited as required to get the required image dimensions
    // Read https://developer.foursquare.com/docs/responses/photo
    return image ? image.prefix + 'original' + image.suffix : null
  }

  render () {
    const { centerLatLng, workouts, profile, onPlaceSelect } = this.props
    const { loadedMapData, activeIndex, parks, parksAndGyms } = this.state

    // Build placeById object
    const indexedPlaces = {}

    parksAndGyms.forEach((park) => {
      var parkVenue = park.venue
      // need to iterate over workouts, matching them to the place_id, adding
      // them as an array to the indexedPlaces
      const filteredWorkouts = workouts.filter((workout) => {
        return parkVenue.id === workout.node.parkId
      })

      indexedPlaces[parkVenue.id] = {
        // comments: workout.comments,
        googleData: {
          parkId: parkVenue.id,
          title: parkVenue.name,
          position: {
            lat: parkVenue.location.lat,
            lng: parkVenue.location.lng,
          },
          rating: parkVenue.rating,
          photos: this.foursquareGetUrl(parkVenue.photos),
          vicinity: parkVenue.location.address,
          // types: parkVenue.types,
          workouts: filteredWorkouts,
        },
      }
    })

    return (
      <div className='__app__grid__container'>
        <div className='__app__body__container__left'>
          {loadedMapData &&
            <MapContainer
              mapCenter={centerLatLng}
              indexedPlaces={indexedPlaces}
              activeMarker={activeIndex}
              geocoder={this.geocoder}
              onMarkerClick={(index, parkID) => this.setActiveIndex(index, parkID)}
              onPlaceSelect={onPlaceSelect}
            />
          }
          {this.state.openedActivity &&
            <ActivityContainer
              indexedPlaces={indexedPlaces}
              openedActivity={this.state.openedActivity}
              parkTitle={indexedPlaces[this.state.openedActivity].googleData.title}
              workouts={indexedPlaces[this.state.openedActivity].googleData.workouts}
              closeActivity={() => this.setActiveIndex()}
            />
          }
        </div>

        <div className='gridList' >
          <div>
            <Tabs>
              <Tab label='Activities' />
              <Tab label='Groups' />
            </Tabs>

            <WorkoutCreator
              indexedPlaces={indexedPlaces}
            />
          </div>

          <ParkContainer
            parks={parks}
            placeById={indexedPlaces}
            profile={profile}
            activeIndex={activeIndex}
            toggleActivity={(parkID) => this.toggleActivity(parkID)}
            onFeedItemClick={(index, parkID) => this.setActiveIndex(index, parkID)}
          />
        </div>
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
