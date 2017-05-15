import React from 'react'
import PropTypes from 'prop-types'
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps'

// https://mapstyle.withgoogle.com/
import mapStyles from './mapStyles.json'
// can we get some hot icons in here? http://map-icons.com/

class MarkerList extends React.Component {
  // gets us our map on click location, may pass for location queries in
  // the future
  geocodeLatLng (obj) {
    const { map } = this._googleMapComponent.props

    var latlng = {
      lat: obj.latLng.lat(),
      lng: obj.latLng.lng(),
    }

    this.props.geocoder.geocode({'location': obj.latLng}, (results, status) => {
      if (status === 'OK') {
        if (results[1]) {
          // why is map not setting to the actual center? appears to be offset by the feed
          map.setCenter(latlng)
          // Display location infowindow on hover
          // this.infowindow.setContent(results[1].formatted_address)
          this.props.onPlaceSelect({
            coordinates: latlng,
            address: results[1].formatted_address,
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

  render () {
    const {
      mapCenter,
      indexedPlaces,
      activeMarker,
      onMarkerClick,
    } = this.props

    return (
      <GoogleMapLoader
        containerElement={<div style={{ height: '100%' }} />}
        googleMapElement={
          <GoogleMap
            ref={(map) => { this._googleMapComponent = map }}
            defaultOptions={{ styles: mapStyles }}
            defaultZoom={14}
            defaultCenter={mapCenter}
            onClick={(...args) => this.geocodeLatLng(...args)}
          >
            {Object.keys(indexedPlaces).map((placeID, index) => {
              return (
                <Marker
                  key={index}
                  animation={activeMarker === index
                    ? window.google.maps.Animation.BOUNCE
                    : null
                  }
                  icon={activeMarker === index
                    ? `https://maps.google.com/mapfiles/ms/icons/lightblue.png`
                    : `https://maps.google.com/mapfiles/ms/icons/pink.png`
                  }
                  {...indexedPlaces[placeID].googleData}
                  onClick={() => onMarkerClick(index, placeID)}
                  onRightclick={() => console.log(placeID, index)}
                />
              )
            })}
          </GoogleMap>
        }
      />
    )
  }
}

MarkerList.propTypes = {
  mapCenter: PropTypes.object.isRequired,
  indexedPlaces: PropTypes.object.isRequired,
  activeMarker: PropTypes.number.isRequired,
  geocoder: PropTypes.object,
  onMarkerClick: PropTypes.func.isRequired,
  onPlaceSelect: PropTypes.func.isRequired,
}

export default MarkerList
