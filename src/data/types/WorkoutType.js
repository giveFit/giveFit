var graphql = require('graphql')
var ObjectType = graphql.GraphQLObjectType
var StringType = graphql.GraphQLString
var NonNull = graphql.GraphQLNonNull

const WorkoutType = new ObjectType({
  name: 'Workout',
  fields: {
    title: { type: new NonNull(StringType) },
    date: { type: new NonNull(StringType) },
    time: { type: StringType },
    location: { type: StringType },
    author: { type: StringType },
    contentSnippet: { type: StringType },
    tags: { type: StringType },
    day: { type: StringType },
    image: { type: StringType},
    avatar: { type: StringType},
    id: { type: StringType},
    lat: { type: StringType},
    lng: { type: StringType}

  }
})

module.exports = WorkoutType
