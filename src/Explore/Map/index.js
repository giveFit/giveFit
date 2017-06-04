import React from 'react'
import PropTypes from 'prop-types'
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps'
import { triggerEvent } from 'react-google-maps/lib/utils'

//looking to use some material ui icons
//import Place from 'material-ui/svg-icons/maps/place'

// https://mapstyle.withgoogle.com/
import mapStyles from './mapStyles.json'
// can we get some hot icons in here? http://map-icons.com/


class Map extends React.Component {
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

  componentDidMount () {
    window.onresize = () => this.handleWindowResize()
  }

  handleWindowResize () {
    triggerEvent(this._googleMapComponent, 'resize')
  }

  render () {
    const {
      mapCenter,
      indexedParks,
      openedParkId,
      onMarkerClick,
    } = this.props

    return (
      <GoogleMapLoader
        containerElement={<div style={{ height: '100%', width: '100%' }} />}
        googleMapElement={
          <GoogleMap
            style={{ height: '100%', width: '100%' }}
            ref={(map) => { this._googleMapComponent = map }}
            defaultOptions={{ styles: mapStyles }}
            defaultZoom={13}
            defaultCenter={mapCenter}
            onClick={(...args) => this.geocodeLatLng(...args)}
          >
            {Object.keys(indexedParks).map((placeID, index) => {
              const place = indexedParks[placeID]

              if (place.workouts.length) {
                return (
                  <Marker
                    key={index}
                    animation={openedParkId === placeID
                      ? window.google.maps.Animation.BOUNCE
                      : null
                    }
                    //<div>Icons made by <a href="http://www.flaticon.com/authors/simpleicon" title="SimpleIcon">SimpleIcon</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
                    icon={openedParkId === placeID
                      ? `data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDQ4NS4yMTMgNDg1LjIxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg1LjIxMyA0ODUuMjEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTI0Mi42MDYsMEMxNDIuMTI0LDAsNjAuNjUxLDgxLjQ3Myw2MC42NTEsMTgxLjk1NXMxNTEuNjMxLDMwMy4yNTcsMTgxLjk1NiwzMDMuMjU3ICAgYzMwLjMyNiwwLDE4MS45NTUtMjAyLjc3NSwxODEuOTU1LTMwMy4yNTdTMzQzLjA4OSwwLDI0Mi42MDYsMHogTTI0Mi42MDYsMzAzLjI1N2MtNjYuOSwwLTEyMS4zMDItNTQuNDMzLTEyMS4zMDItMTIxLjMwMiAgIFMxNzUuNzA2LDYwLjY1MSwyNDIuNjA2LDYwLjY1MWM2Ni45MDIsMCwxMjEuMzAyLDU0LjQzNSwxMjEuMzAyLDEyMS4zMDRTMzA5LjUwOSwzMDMuMjU3LDI0Mi42MDYsMzAzLjI1N3oiIGZpbGw9IiMxZjAxYjkiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K`
                      : `data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDQ4NS4yMTMgNDg1LjIxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg1LjIxMyA0ODUuMjEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTI0Mi42MDYsMEMxNDIuMTI0LDAsNjAuNjUxLDgxLjQ3Myw2MC42NTEsMTgxLjk1NXMxNTEuNjMxLDMwMy4yNTcsMTgxLjk1NiwzMDMuMjU3ICAgYzMwLjMyNiwwLDE4MS45NTUtMjAyLjc3NSwxODEuOTU1LTMwMy4yNTdTMzQzLjA4OSwwLDI0Mi42MDYsMHogTTI0Mi42MDYsMzAzLjI1N2MtNjYuOSwwLTEyMS4zMDItNTQuNDMzLTEyMS4zMDItMTIxLjMwMiAgIFMxNzUuNzA2LDYwLjY1MSwyNDIuNjA2LDYwLjY1MWM2Ni45MDIsMCwxMjEuMzAyLDU0LjQzNSwxMjEuMzAyLDEyMS4zMDRTMzA5LjUwOSwzMDMuMjU3LDI0Mi42MDYsMzAzLjI1N3oiIGZpbGw9IiNjZTFmM2MiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K`
                    }
                    {...place}
                    onClick={() => onMarkerClick(placeID)}
                    onRightclick={() => console.log(placeID, index)}
                  />
                )
              }
            })}
          </GoogleMap>
        }
      />
    )
  }
}

Map.propTypes = {
  mapCenter: PropTypes.object.isRequired,
  indexedParks: PropTypes.object.isRequired,
  openedParkId: PropTypes.string.isRequired,
  geocoder: PropTypes.object,
  onMarkerClick: PropTypes.func.isRequired,
  onPlaceSelect: PropTypes.func.isRequired,
}

export default Map
