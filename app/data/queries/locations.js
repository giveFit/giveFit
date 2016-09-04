var graphql = require('graphql');
var List = graphql.GraphQLList;

var WorkoutList = require('./fakeData/workoutData');
var LocationType = require('../types/LocationType');

const locations = {
	type: new List(LocationType),
	resolve: function(source) {
		return WorkoutList;
	}
};

module.exports = locations;