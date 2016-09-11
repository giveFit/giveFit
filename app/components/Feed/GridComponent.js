import React, { PropTypes,Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import GridList from 'material-ui/GridList'
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

import MainFeed from './subComponents/MainFeed';

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

class GridComponent extends Component {
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
              this.props.onPlaceSelect(results[1].formatted_address);
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
                     onClick={(...args)=>this.geocodeLatLng(...args)}
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

             <GridList
                style={styles.gridList}
                cols={1}
                cellHeight={500}
                padding={1}
              >


                {props.workouts.map((item, index) => (
                     <div key={index}> {!item ||
                      (<MainFeed
                        data={item}
                     />)} </div>

                ))}
              </GridList>
            </div>

        );
    }
}

export default GridComponent;
