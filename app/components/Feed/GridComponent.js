import React, { PropTypes,Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import GridList from 'material-ui/GridList'
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

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
      this.clickMarker = null;
      this.infowindow = new googleMaps.InfoWindow;
      console.log(this.props);
    }



    geocodeLatLng(obj) {
        const {map} = this._googleMapComponent.props;
        //var input = "40,-90";
        //var latlngStr = input.split(',', 2);
        console.log("this is the geocoded object", obj.latLng)
        var latlng = {lat: obj.latLng.lat(), lng: obj.latLng.lng()};
        console.log("this is latlng", latlng)
        this.geocoder.geocode({'location': obj.latLng}, (results, status)=>{
          if (status === 'OK') {
            if (results[1]) {
              map.setZoom(9);
              map.setCenter(latlng);
              var marker = new google.maps.Marker({
                position: latlng,
                icon : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                map: map
              });
              if(this.clickMarker){
                  this.clickMarker.setMap(null);
              }
              this.clickMarker = marker;
              this.infowindow.setContent(results[1].formatted_address);
              this.props.onPlaceSelect({
                  coordinates : latlng,
                  address : results[1].formatted_address
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
      const {workouts} = props;

      console.log("props markers", props.markers);

      const listView = workouts.length ? <GridList
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
        </GridList> :  <Card>
              <CardHeader
                title="No Workouts In this location"
                subtitle="Please try a different location"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                We are working to get workouts here
              </CardText>
            </Card>

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
                     defaultCenter={{ lat: 39.2904, lng: -76.6122 }}
                     onClick={(...args)=>{
                      console.log("map args",...args);
                      return this.geocodeLatLng(...args)
                     }}
                   >
                   {console.log("props for markers", props.markers)}
                     {props.markers ? props.markers.map((marker, index) => {
                       return (
                         <Marker
                          key={index}
                           {...marker}
                           onRightclick={() => console.log(marker,index)} />
                       );
                     }) : null}
                   </GoogleMap>
                 }
               />


             </section>
             {listView}

            </div>

        );
    }
}

export default GridComponent;
