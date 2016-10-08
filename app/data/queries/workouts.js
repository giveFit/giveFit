var graphql = require('graphql');
var List = graphql.GraphQLList;
var StringType = graphql.GraphQLString;

var WorkoutList = require('./fakeData/workoutData');
var WorkoutType = require('../types/WorkoutType');

var distance = require('google-distance')
var debug = require('debug');
//Mock API
var WorkoutList = require('./fakeData/workoutData');

//Type
var MutationType = require('../types/MutationType');

distance.apiKey = 'AIzaSyAJwnW0tijEPtd2YUH_e7uW1U0vIWLtg0k';

// Workout feed
const workouts = {
  type: new List(WorkoutType),
  args: { latLng: { type: StringType }},
	resolve: (root, { latLng }, args) => {
		/*eventually will want to turn this into a promise-based
		architecture, callbacks ok for now*/
		console.log("argssss")
		console.log(latLng)

		//building our locationParams
		function getWorkoutParams(workouts){
			var workoutsArray = workouts.map(function(workout){
				var lat = workout.lat
				var lng = workout.lng
				var workoutCoordinates = lat + "," + lng;
				return workoutCoordinates;
			})
			return {
				origins: [latLng],
				destinations: workoutsArray
			}
		}

		function getFilteredWorkouts(workouts){
			return new Promise(function(resolve, reject){
				distance.get(getWorkoutParams(workouts), function(err, result){
			      	var distances = result;

          if(!distances){
            debug('No distances');
            return resolve([]);
          }
					workouts.forEach(function(workout, index){
						workout.distance = distances[index].distanceValue
					})


					var filtered = workouts.filter(function(el){
						debug(el.distance);
						return el.distance < 5000
					})
					//console.log(filtered)

					resolve(filtered);
		  		});
			})
		}
		//WorkoutList Call
		return getFilteredWorkouts(WorkoutList)
	}
};

module.exports = workouts;
