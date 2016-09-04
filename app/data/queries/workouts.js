var graphql = require('graphql');
var List = graphql.GraphQLList;

var WorkoutList = require('./fakeData/workoutData');
var WorkoutType = require('../types/WorkoutType');
// Workout feed
const workouts = {
  type: new List(WorkoutType),
  resolve: function(source) {
  		return WorkoutList;
  	}
};

module.exports = workouts;