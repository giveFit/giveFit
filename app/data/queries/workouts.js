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
				return workout;
			}		
		}) 
		
	})
};

let origin = "39.292013,-76.653072";
console.log("Hey here's getWorkoutListDistances")
getWorkoutListDistances(WorkoutList)

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
		let workoutsArray = [];
	  	let origin = "39.292013,-76.653072";
/*	  	console.log(WorkoutList);
*/	  	return WorkoutList.map((workout, index)=>{
			var lat = workout.lat;
			var lng = workout.lng;
			var workoutCoordinates = lat + "," + lng;
		    var params = {
		      origin: origin,
		      destination: workoutCoordinates
		    }
			
			/*workoutsArray.push(workout);
			console.log("workoutsArray1");
			console.log(workoutsArray);*/

			calculateDistance(params, (err, distance)=>{
				if(err){
					console.error(err)
				} else {
					var distanceInMeters = distance.distanceValue
					workout.distance = distanceInMeters
					console.log("workout")
					console.log(workout)
					
					workoutsArray.push(workout);
					console.log("workoutsArray1");
					console.log(workoutsArray);

				};
			})
			console.log("after calculate distance");
			return;
	  	});

		console.log('workoutsArray2');
		console.log(workoutsArray)	
	  	return workoutsArray;
	}
};

module.exports = workouts;