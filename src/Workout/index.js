import React from 'react'
import { graphql } from 'react-apollo'
import { GET_BY_SLUG } from '../Explore/gql'

class Workout extends React.Component {
  render () {
    return (
      <div>
        {this.props.params.workoutId}
      </div>
    )
  }
}

const withData = graphql(GET_BY_SLUG, {
  options: ({ params }) => ({
    variables: {
      where: {
        slug: {
          eq: params.workoutId,
        },
      },
    },
  }),
  props: ({ data: { viewer, loading, subscribeToMore } }) => ({
    viewer,
    loading,
    subscribeToMore,
  }),
})

const WorkoutWithData = withData(Workout)

export default WorkoutWithData
