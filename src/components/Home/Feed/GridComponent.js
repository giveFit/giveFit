import React, { PropTypes,Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import GridList from 'material-ui/GridList'
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import MainFeed from './subComponents/MainFeed';
import geocoder from '../../../utils/geocoder';

const height = window.innerHeight - 64;

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: height,
    overflowY : 'auto',
    background : '#e5e5e5'
  },
  workout : {
    padding : '20px 12px 10px',
    boxSizing : 'border-box'
  }
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
      this.state = {
        activeIndex : -1
      };
      // now grab the services we need
      this.googleMaps = googleMaps;
      this.geocoder = new googleMaps.Geocoder();
      this.clickMarker = null;
      this.infowindow = new googleMaps.InfoWindow;


    }
    /*Not really liking the yellow dot, may need to reimplement 
    something here if we end up re-implementing the location query*/
   /* geocoder(obj, function(err, latLng){
      if(err){
        console.error('geocoder error', err)
      }else{

      }
    })*/
    
    markerClick(index){
      this.setState({activeIndex : index});
    }


    render(){
      const {props} = this;
      const {activeIndex} = this.state;
      const {workouts} = props;

      console.log("props markers", props.markers);

      const listView = workouts.length ? <div
          style={styles.gridList}
        >
          {props.workouts.map((item, index) => (
               <div key={index} style={styles.workout}> {!item ||
                (<MainFeed
                  active={activeIndex===index}
                  data={item.node}
               />)} </div>
          ))}
        </div> :  <Card>
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
                       height: height,
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
                           onClick={()=>this.markerClick(index)}
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
