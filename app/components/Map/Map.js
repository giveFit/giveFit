import React, { PropTypes,Component } from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";

//Apollo
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 500,
    overflowY: 'auto',
    marginBottom: 24,
  },
};

const latlng = { "lat" : 39.283402,
                  "lng" : -76.612912 }

class MapComponent extends Component {
    constructor(props){
      super(props);
      // grab our googleMaps obj from whever she may lay
      var googleMaps = this.props.googleMaps ||
        (window.google && // eslint-disable-line no-extra-parens
          window.google.maps) ||
        this.googleMaps;

      if (!googleMaps) {
        console.error(// eslint-disable-line no-console
          'Google map api was not found in the page.');
        return;
      }
      // now grab the services we need
      this.googleMaps = googleMaps;
      this.geocoder = new googleMaps.Geocoder();
      this.infowindow = new googleMaps.InfoWindow;
      console.log(this.props);
    }

    geocodeLatLng(obj) {
        const {map} = this._googleMapComponent.props;
        //var input = "40,-90";
        //var latlngStr = input.split(',', 2);
        var latlng = {lat: obj.latLng.lat(), lng: obj.latLng.lng()};
        this.geocoder.geocode({'location': latlng}, (results, status)=>{
          if (status === 'OK') {
            if (results[1]) {
              map.setZoom(9);
              map.setCenter(latlng);
              var marker = new google.maps.Marker({
                position: latlng,
                map: map
              });
              this.infowindow.setContent(results[1].formatted_address);
              this.props.onPlaceSelect({
                  coordinates : latlng,
                  address :results[1].formatted_address
              });
              this.infowindow.open(map, marker);
            } else {
              //window.alert('No results found');
            }
          } else {
            //window.alert('Geocoder failed due to: ' + status);
          }
        });
      }

    render(){
      const {props} = this;
      console.log(props);
      return (
            <div style={styles.root}>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDaqZIUzhyOdPDlsVjkdLbuWj89F3gNCMg" ></script>  
            <section style={{height: "100%",flex:1}}>
               <GoogleMapLoader
                 containerElement={
                   <div
                     {...props.containerElementProps}
                     style={{
                       height: "100%",
                     }}
                   />
                 }
                 googleMapElement={
                   <GoogleMap
                     ref={(map) => { this._googleMapComponent = map ; console.log(map);} }
                     defaultZoom={8}
                     defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
                     onClick={(...args)=>{
                      console.log(...args);
                      return this.geocodeLatLng(...args)
                     }}
                   >
                     {props.markers ? props.marker.map((marker, index) => {
                       return (
                         <Marker
                           {...marker}
                           onRightclick={() => console.log(marker,index)} />
                       );
                     }) : null}
                   </GoogleMap>
                 }
               />
             </section>
             </div>
        );
    }
};

const GET_WORKOUTS_VIA_LATLNG = gql `
  mutation getWorkoutsViaLatLng {
    getWorkoutsViaLatLng(latlng: $latlng) {
      workouts
    }
  }
`;

/*We need an api which 
takes lat and lng as input 
and returns workouts as output*/

const MapComponentWithData = graphql(GET_WORKOUTS_VIA_LATLNG, {
  props({ mutate }) {
    return {
      submit(latlng) {
        return mutate({ variables: { latlng}})
      }
    }
  }
})(MapComponent);

export default MapComponentWithData;