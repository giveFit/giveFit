var graphql = require('graphql');
var List = graphql.GraphQLList;

var WorkoutList = require('./fakeData/workoutData');
var WorkoutType = require('../types/WorkoutType');

var distance = require('google-distance')

//Mock API
var WorkoutList = require('./fakeData/workoutData');

//Type
var MutationType = require('../types/MutationType');

distance.apiKey = 'AIzaSyAJwnW0tijEPtd2YUH_e7uW1U0vIWLtg0k';


//Filter workouts by their distance to the origin
function filterByDistance(obj){
	if (obj.distance > 10000) {
		return true;
	} else {
		return false;
	}
};


// Workout feed
const workouts = {
  type: new List(WorkoutType),
	resolve: (source, args) => {
	/*eventually will want to turn this into a promise-based
	architecture, callbacks ok for now*/
	
	//dummy variable pass
	let origin = "39.292013,-76.653072";
	//defining our filtered array
	let workoutsArray = [];
	//Using google maps package wrapper
	function calculateDistance(params, callback){
	  distance.get(params, function(err, result){
	      var distance = result;
	      callback(null, distance)
	  });
	}	
	
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
					workout.distance = distanceInMeters			
				}		
			})
		//Building up array of workout objects
		workoutsArray.push(workout);
		})
		//returning workouts
		return workoutsArray
	};

	return getWorkoutListDistances(WorkoutList)
	}
};

module.exports = workouts;