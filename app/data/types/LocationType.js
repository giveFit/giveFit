var graphql = require('graphql');
var ObjectType = graphql.GraphQLObjectType;
var StringType = graphql.GraphQLString;
var NonNull = graphql.GraphQLNonNull;

const LocationType = new ObjectType({
	name: 'Location',
	fields: {
		location: { type: StringType },
		lat: { type: StringType },
		lng: { type: StringType },
	},
});

module.exports = LocationType;