import React from 'react'
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps'

import {searchNearby} from 'utils/googleApiHelpers'

import ParkContainer from './ParkContainer'
import ActivityContainer from './ActivityContainer'

// https://mapstyle.withgoogle.com/
import mapStyles from '../constants/mapStyles.json'
// can we get some hot icons in here? http://map-icons.com/

const styles = {
  root: {
    display: 'flex',
    flex: 1,
    overflowY: 'hidden'
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

    // const {googleMaps} = this.props
    // Need to update these searches when a new map center is created
    // baltimore parks search params
    const parks = {
      location: centerLatLng,
      radius: 5000,
      type: 'park'
    }

    // baltimore gym search params
    const gyms = {
      location: centerLatLng,
      radius: 5000,
      type: 'gym'
    }

    try {
      // search and add parks to state
      // add meetup activities as well https://www.npmjs.com/package/meetup-crawler
      // or https://github.com/jkutianski/meetup-api/tree/0.1.X
      const parksPromise = searchNearby(this.googleMaps, div, parks)
      const gymsPromise = searchNearby(this.googleMaps, div, gyms)
      Promise.all([parksPromise, gymsPromise])
        .then(([parksResult, gymsResult]) => {
          this.setState({
            parks: parksResult,
            parksAndGyms: parksResult.concat(gymsResult),
            loadedMapData: true
          })
        })
    } catch (err) {
      console.log(err)
    }
  }

  toggleActivity (parkID = '') {
    if (parkID === this.state.openedActivity) {
      parkID = ''
    }

    this.setState({ openedActivity: parkID })
  }

  // gets us our map on click location, may pass for location queries in
  // the future
  geocodeLatLng (obj) {
    const { map } = this._googleMapComponent.props

    // var input = "40,-90";
    // var latlngStr = input.split(',', 2);
    var latlng = {
      lat: obj.latLng.lat(),
      lng: obj.latLng.lng()
    }

    this.geocoder.geocode({'location': obj.latLng}, (results, status) => {
      if (status === 'OK') {
        if (results[1]) {
          // why is map not setting to the actual center? appears to be offset by the feed
          map.setCenter(latlng)
          // Display location infowindow on hover
          // this.infowindow.setContent(results[1].formatted_address)
          this.props.onPlaceSelect({
            coordinates: latlng,
            address: results[1].formatted_address
          })
          // this.infowindow.open(map, marker)
        } else {
          // window.alert('No results found');
        }
      } else {
        // window.alert('Geocoder failed due to: ' + status);
      }
    })
  }

  markerClick (index) {
    this.setActiveIndex(index)
  }

  feedItemClick (index) {
    this.setActiveIndex(index)
  }

  setActiveIndex (index) {
    this.setState({ activeIndex: index })
  }

  render () {
    const {props} = this
    const { latLng } = props
    const centerLatLng = {
      lat: latLng ? latLng.lat : 39.2904,
      lng: latLng ? latLng.lng : -76.6122
    }

    const { loadedMapData } = this.state
    const { activeIndex, parks, parksAndGyms, markers } = this.state
    // Build placeById object
    const placeById = {}

    parksAndGyms.forEach(s => {
      // const place_id = s.place_id
      // console.log('each spot', s)
      // need to iterate over workouts, matching them to the place_id, adding
      // them as an array to the placeById
      const filteredWorkouts = props.workouts.filter((w) => {
        return s.place_id === w.node.parkId && w.node.Workout
        // return s.place_id == w.node.parkId
      })

      placeById[s.place_id] = {
        // comments: workout.comments,
        googleData: {
          parkId: s.place_id,
          title: s.name,
          position: {
            lat: s.geometry.location.lat(),
            lng: s.geometry.location.lng()
          },
          rating: s.rating,
          photos: s.photos ? s.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 750}) : null,
          vicinity: s.vicinity,
          types: s.types,
          workouts: filteredWorkouts
        }
      }
    })

    return (
      <div style={styles.root} className='__app__body__container'>
        <section className='__app__body__container__left' ref={(node) => this.mapSection = node}>
          {loadedMapData
            ? <GoogleMapLoader
              containerElement={
                <div
                  {...props.containerElementProps}
                  style={{
                    height: '100%'
                  }}
                />
              }
              googleMapElement={
                <GoogleMap
                  ref={(map) => { this._googleMapComponent = map }}
                  defaultOptions={{ styles: mapStyles}}
                  defaultZoom={14}
                  defaultCenter={centerLatLng}
                  onClick={(...args) => this.geocodeLatLng(...args)}
                >
                  {parksAndGyms.length
                    ? Object.keys(placeById).map((marker, index) => {
                      return (
                        <Marker
                          key={index}
                          animation={activeIndex === index
                            ? window.google.maps.Animation.BOUNCE
                            : null
                          }
                          icon={activeIndex === index
                            ? `https://maps.google.com/mapfiles/ms/icons/lightblue.png`
                            : `https://maps.google.com/mapfiles/ms/icons/pink.png`
                          }
                          {...placeById[marker].googleData}
                          onClick={() => this.markerClick(index)}
                          onRightclick={() => console.log(marker, index)}
                        />
                      )
                    })
                    : null
                  }
                </GoogleMap>
              }
            />
            : null
          }
        </section>
        {this.state.openedActivity &&
          <ActivityContainer
            workouts={placeById[this.state.openedActivity].googleData.workouts}
          />
        }
        <ParkContainer
          parks={parks}
          placeById={placeById}
          profile={props.profile}
          activeIndex={activeIndex}
          toggleActivity={(parkID) => this.toggleActivity(parkID)}
        />
      </div>
    )
  }
}

export default GridComponent
