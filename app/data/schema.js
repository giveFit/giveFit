var graphql = require('graphql');
var Schema = graphql.GraphQLSchema;
var ObjectType = graphql.GraphQLObjectType;

var workouts =require('./queries/workouts');
var locations = require('./queries/locations');
var getWorkoutsViaLatLng = require('./queries/mutation')

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      workouts,
      locations,
    },
  }),
});

module.exports = schema;
