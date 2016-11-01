var graphql = require('graphql');
var List = graphql.GraphQLList;
var distance = require('google-distance')

//Mock API
var WorkoutList = require('./fakeData/workoutData');

//Type
var MutationType = require('../types/MutationType');

distance.apiKey = 'AIzaSyAJwnW0tijEPtd2YUH_e7uW1U0vIWLtg0k';

function calculateDistance(params, callback){
  distance.get(params, function(err, result){
      var distance = result;
      callback(null, distance)
  });
}

	
/*I want to go through my workout list and return 
any workouts within 10 miles

a. submit orign and destination as "params" to distance
b. push distance to workouts object
b. filter those workouts to return workouts greater than 10 miles*/

function getWorkoutListDistances(workouts) {
	workouts.map((workout, index)=>{
	var lat = workout.lat;
	var lng = workout.lng;
	var workoutCoordinates = lat + "," + lng;
    var params = {
      origin: origin,
      destination: workoutCoordinates
    }

	calculateDistance(params, (err, distance)=>{
		if(err){
			console.error(err)
			}else{
				var distanceInMeters = distance.distanceValue
				console.log('distanceInMeters')
				console.log(distanceInMeters)
				console.log('workout')
				workout.distance = distanceInMeters
				console.log(workout)
			}		
		}) 
		
	})
};


//Filter workouts by their distance to the origin
function filterByDistance(obj){
	if (obj.distance > 10000) {
		return true;
	} else {
		return false;
	}
};


const getWorkoutsViaLatLng = {
	  type: new List(MutationType),
	  resolve: (source, args) => {
		let origin = "39.292013,-76.653072";

		return WorkoutList;

		/*getWorkoutListDistances(WorkoutList)*/

	}
}

module.exports = getWorkoutsViaLatLng;



