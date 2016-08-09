var graphql = require('graphql');
var Schema = graphql.GraphQLSchema;
var ObjectType = graphql.GraphQLObjectType;

var workouts =require('./queries/workouts');

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      workouts,
    },
  }),
});

module.exports = schema;
