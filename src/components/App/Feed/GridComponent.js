import React, { PropTypes, Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import GridList from 'material-ui/GridList'
import {GoogleMapLoader, GoogleMap, Marker} from 'react-google-maps';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import ParkFeed from './subComponents/ParkFeed';
import GymFeed from './subComponents/GymFeed';
import {searchNearby} from 'utils/googleApiHelpers';

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
        activeIndex : -1,
        parks: [],
        parksAndGyms: [],
        markers: [],
        pagination: null
      };
      // now grab the services we need
      this.googleMaps = googleMaps;
      this.geocoder = new googleMaps.Geocoder();
      /*this.placesService = new googleMaps.PlacesService(map);*/
      this.clickMarker = null;
      this.infowindow = new googleMaps.InfoWindow;
    }
    /*Working on Google API for location fetching
    This google apis return the places in sets of 20, the maximum number of places that an api can fetch is 60. If you carefully observe the response of the google places api, it has a parameter called next_pagetoken. So the second time you hit the API u need to pass this next_pagetoken to fetch the next set of schools.@ChithriAjay
    how to do multiple types
    http://stackoverflow.com/questions/19625228/google-maps-api-multiple-keywords-in-place-searches*/
    componentDidMount(obj){
    const div = document.createElement('div')
    console.log("isMounted method", div)
    /*const {googleMaps} = this.props;*/
    //Need to update these searches when a new map center is created
    //baltimore parks search params
    const parks = {
      location: { lat: 39.2904, lng: -76.6122 },
      radius: 50000,
      type: 'park'
    }
    //baltimore gym search params
    const gyms = {
      location: { lat: 39.2904, lng: -76.6122 },
      radius: 5000,
      type: 'gym'
    }
    //search and add parks to state
    searchNearby(this.googleMaps, div, parks)
      .then((results, pagination) => {
        console.log('searchNearby parks', results)
        console.log('searchNearby pagination', pagination)
        this.setState({
          parks: results,
          pagination
        })
      }).catch((status, result) => {
        console.error('error', status, result)
      })
    //search and add gyms to state  
    searchNearby(this.googleMaps, div, gyms)
      .then((results, pagination) => {
        console.log('searchNearby gyms', results)
        console.log('searchNearby pagination', pagination)
        this.setState({
          parksAndGyms: this.state.parks.concat(results),
          pagination
        })
      }).catch((status, result) => {
        console.error('error', status, result)
      })
    }

    /*gets us our map on click location, 
    may pass for location queries in the future*/
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
          //why is map not setting to the actual center? appears to be offset by the feed
          map.setCenter(latlng);
          //Display location infowindow on hover  
          /*this.infowindow.setContent(results[1].formatted_address);*/
          this.props.onPlaceSelect({
              coordinates : latlng,
              address : results[1].formatted_address
          });
          /*this.infowindow.open(map, marker);*/
        } else {
          //window.alert('No results found');
        }
        } else {
        //window.alert('Geocoder failed due to: ' + status);
        }
      });
    }
    markerClick(index){
      this.setState({activeIndex : index});
    }
    render(){
      const {props} = this;
      const {activeIndex, parks, parksAndGyms, markers} = this.state;

      //Build placeById object
      const placeById = {}
      parksAndGyms.forEach(s => {
        /*const place_id = s.place_id*/
        //console.log('each spot', s)
        /*const workout = workouts.find(w => w.placeId == place_id)*/
        placeById[s.place_id] = {
          /*comments: workout.comments,*/
          googleData: {
            title: s.name,
            position : {
                lat : s.geometry.location.lat(),
                lng : s.geometry.location.lng()
            },
            rating: s.rating,
            photos: s.photos,
            vicinity: s.vicinity,
            types: s.types
          }
        }
      })

      console.log('placeById', placeById)
    
      //list with google data
      const gListView = parks.length ? <div
          style={styles.gridList} 
          > {Object.keys(placeById).map((item, index) => (
               <div key={index} style={styles.workout}> {!item ||
                (placeById[item].googleData.types.indexOf('park') !== -1 ? <ParkFeed
                  active={activeIndex===index}
                  data={placeById[item]}
               /> : <GymFeed
                  active={activeIndex===index}
                  data={placeById[item]}
               />)} </div>
          ))} 
          </div> : <Card>
              <CircularProgress size={80} />
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
                    ref={(map) => { this._googleMapComponent = map ; console.log("the map", map);} }
                    defaultZoom={13}
                    defaultCenter={{ lat: 39.287014134966526, lng: -76.55342102050781 }}
                    onClick={(...args)=>{
                      console.log("map args", ...args);
                      return this.geocodeLatLng(...args)
                     }}
                   >
                     {parksAndGyms.length ? Object.keys(placeById).map((marker, index) => {
                       return (
                         <Marker
                          key={index}
                           {...placeById[marker].googleData}
                           onClick={()=>this.markerClick(index)}
                           onRightclick={() => console.log(marker,index)} />
                       );
                     }) : null}
                   </GoogleMap>
                 }
               />
             </section>
             {gListView}
            </div>

        );
    }
}

export default GridComponent;
