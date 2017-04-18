import React from 'react'

import {searchNearby} from 'utils/googleApiHelpers'

import foursquare from 'utils/foursquareApi'

import ParkContainer from './ParkContainer'
import ActivityContainer from './ActivityContainer'
import MapContainer from './MapContainer'

const styles = {
  root: {
    display: 'flex',
    flex: 1,
    overflowY: 'hidden'
  },
  containerLeft: {
    position: 'relative'
  },
  gridList: {
    width: 500,
    paddingTop: 65,
    position: 'relative',
    background: '#e5e5e5',
    display: 'flex'
  },
  workout: {
    padding: '20px 12px 10px',
    boxSizing: 'border-box'
  }
}

class GridComponent extends React.Component {
  constructor (props) {
    super(props)

    // grab our googleMaps obj from whever she may lay
    var googleMaps = this.props.googleMaps ||
      (window.google && // eslint-disable-line no-extra-parens
        window.google.maps) ||
      this.googleMaps

    if (!googleMaps) {
      console.error('Google map api was not found in the page.')
      return
    }

    this.state = {
      activeIndex: -1,
      parks: [],
      parksAndGyms: [],
      markers: [],
      pagination: null,
      loadedMapData: false,
      openedActivity: ''
    }

    // now grab the services we need
    this.googleMaps = googleMaps
    this.geocoder = new googleMaps.Geocoder()
    // this.placesService = new googleMaps.PlacesService(map)
    this.clickMarker = null
    this.infowindow = new googleMaps.InfoWindow
  }

  /*
    Working on Google API for location fetching
    This google apis return the places in sets of 20, the maximum number of places that an api can fetch is 60. If you carefully observe the response of the google places api, it has a parameter called next_pagetoken. So the second time you hit the API u need to pass this next_pagetoken to fetch the next set of schools.@ChithriAjay
    how to do multiple types
    http://stackoverflow.com/questions/19625228/google-maps-api-multiple-keywords-in-place-searches
  */
  componentDidMount () {
    const { latLng } = this.props
    const centerLatLng = {
      lat: latLng ? latLng.lat : 39.2904,
      lng: latLng ? latLng.lng : -76.6122
    }

    const div = document.createElement('div')

    //Note : This concatination logic can be moved to foursquareApi.js to keep it consistent with googleApi
    //FourSquare category tree: https://developer.foursquare.com/categorytree
    const recCenters = {
      ll: centerLatLng.lat.toString().concat(','+centerLatLng.lng.toString()),
      radius: 5000,
      query: 'recreation center',
      venuePhotos: 1
    }
    const parks = {
      ll: centerLatLng.lat.toString().concat(','+centerLatLng.lng.toString()),
      radius: 5000,
      query: 'park',
      venuePhotos: 1
    }



    // const {googleMaps} = this.props

    // Need to update these searches when a new map center is created
    // baltimore parks search params
    // const parks = {
    //   location: centerLatLng,
    //   radius: 5000,
    //   type: 'park'
    // }
    //
    // // baltimore gym search params
    // const gyms = {
    //   location: centerLatLng,
    //   radius: 5000,
    //   type: 'gym'
    // }

    try {
      //search and add parks to state
      //add meetup activities as well https://www.npmjs.com/package/meetup-crawler
      //or https://github.com/jkutianski/meetup-api/tree/0.1.X
      // const parksPromise = searchNearby(this.googleMaps, div, parks)
      // const gymsPromise = searchNearby(this.googleMaps, div, gyms)
      // Promise.all([parksPromise, gymsPromise])
      //   .then(([parksResult, gymsResult]) => {
      //     this.setState({
      //       parks: parksResult,
      //       parksAndGyms: parksResult.concat(gymsResult),
      //       loadedMapData: true
      //     })
      //   })


      //Foursquare api calls
      //Explore: https://developer.foursquare.com/docs/venues/explore
      const recCentersPromise = foursquare.venues.explore(recCenters)
      const parksPromise = foursquare.venues.explore(parks)
      Promise.all([parksPromise,recCentersPromise])
        .then(([recCentersResult,parksResult]) => {
          this.setState({
            // NOTE: move this traversal to the utils files
            parks: parksResult.response.groups[0].items,
            parksAndGyms: parksResult.response.groups[0].items.concat(recCentersResult.response.groups[0].items),
            loadedMapData: true
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
    console.log('setActiveIndex', parkID, index)

    var newIndex
    if(index == undefined ){
      newIndex = -1
    }else{
      newIndex = index
    }
    this.setState(
      { openedActivity: parkID,
        activeIndex: newIndex
      }
    )
  }

  //Url generator for foursquare
  foursquareGetUrl(photos){
    var image = photos.groups && photos.groups[0] && photos.groups[0].items[0]
    //the original can be edited as required to get the required image dimensions
    //Read https://developer.foursquare.com/docs/responses/photo
    return image ? image.prefix + 'original' + image.suffix : null
  }

  render () {
    const {
      latLng,
      workouts,
      profile
    } = this.props
    const mapCenter = {
      lat: latLng ? latLng.lat : 39.2904,
      lng: latLng ? latLng.lng : -76.6122
    }

    const { loadedMapData } = this.state
    const { activeIndex, parks, parksAndGyms, markers } = this.state
    // Build placeById object
    const indexedPlaces = {}

    parksAndGyms.forEach((park) => {
      //console.log('parksAndGyms', park)
      var parkVenue = park.venue;
      // const place_id = park.place_id
      // console.log('each spot', s)
      // need to iterate over workouts, matching them to the place_id, adding
      // them as an array to the indexedPlaces
      const filteredWorkouts = workouts.filter((workout) => {
        return parkVenue.id === workout.node.parkId && workout.node.Workout
      })

      // indexedPlaces[park.place_id] = {
      //   // comments: workout.comments,
      //   googleData: {
      //     parkId: park.place_id,
      //     title: park.name,
      //     position: {
      //       lat: park.geometry.location.lat(),
      //       lng: park.geometry.location.lng()
      //     },
      //     rating: park.rating,
      //     photos: park.photos ? park.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 750}) : null,
      //     vicinity: park.vicinity,
      //     types: park.types,
      //     workouts: filteredWorkouts
      //   }
      // }
      parkVenue.types = parkVenue.categories.map((a)=>a.name)

      //Values need to be reassigned as per the app
      indexedPlaces[parkVenue.id] = {
        // comments: workout.comments,
        googleData: {
          parkId: parkVenue.id,
          title: parkVenue.name,
          position: {
            lat: parkVenue.location.lat,
            lng: parkVenue.location.lng
          },
          rating: parkVenue.rating,
          photos: this.foursquareGetUrl(parkVenue.photos),
          vicinity: parkVenue.location.address,
          types: parkVenue.types,
          workouts: filteredWorkouts
        }
      }
    })

    return (
      <div style={styles.root} className='__app__body__container'>
        <div
          style={styles.containerLeft}
          className='__app__body__container__left'
          ref={(node) => this.mapSection = node}
        >
          {loadedMapData &&
            <MapContainer
              mapCenter={mapCenter}
              indexedPlaces={indexedPlaces}
              activeMarker={activeIndex}
              geocoder={this.geocoder}
              onMarkerClick={(index, parkID) => this.setActiveIndex(index, parkID)}
            />
          }
          {this.state.openedActivity &&
            <ActivityContainer
              openedActivity={this.state.openedActivity}
              parkTitle={indexedPlaces[this.state.openedActivity].googleData.title}
              workouts={indexedPlaces[this.state.openedActivity].googleData.workouts}
              //closeActivity={() => this.setActiveIndex(index, parkID)}
              closeActivity={() => this.setActiveIndex()}
            />
          }
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
    )
  }
}

export default GridComponent
