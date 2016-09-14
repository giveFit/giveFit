var graphql = require('graphql');
var List = graphql.GraphQLList;
var GoogleMapsAPI = require('googlemaps');

var MutationType = require('../types/MutationType');

//Mock API
var WorkoutList = require('./fakeData/workoutData');

var publicConfig = {
  key: 'AIzaSyDaqZIUzhyOdPDlsVjkdLbuWj89F3gNCMg',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true, // use https 
  //proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests 
};
 
var gmAPI = new GoogleMapsAPI(publicConfig);

function calculateDistances(latlng) {

  		var destinations = [
		    "2033 Dorsett Village, Maryland Heights, MO 63043",
		    "1208 Tamm Avenue, St. Louis, MO 63139",
		    "1964 S Old Highway 94 St Charles, MO 63303"];

		    gmAPI.getDistanceMatrix({
		        origins: [latlng], //array of origins
		        destinations: destinations, //array of destinations
		        travelMode: google.maps.TravelMode.DRIVING,
		        unitSystem: google.maps.UnitSystem.METRIC,
		        avoidHighways: false,
		        avoidTolls: false
		    }, callback);
}	

const getWorkoutsViaLatLng = {
  type: new List(MutationType),
  resolve: (source, args) => {
  		let latlng = Object.assign({}, args);

  		console.log(latlng);
  		
  		return calculateDistances(latlng)

		function callback(response, status) {
		    if (status != google.maps.DistanceMatrixStatus.OK) {
		        alert('Error was: ' + status);
		    } else {
		        //we only have one origin so there should only be one row
		        var routes = response.rows[0];
		        
		        //return routes that are less than 10 miles
		        //1,609.34 meters in a mile (the duration value is returned in meters)
		        routes.filter((route) => {
		            return routes.elements[route].duration.value < 16093.4
		        })
		    }
		}
  	}
}

module.exports = getWorkoutsViaLatLng;