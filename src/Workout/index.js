import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { GET_BY_SLUG } from '../Explore/gql'
import { has } from 'lodash'
import { CardText, Chip, Avatar, RaisedButton } from 'material-ui'
import moment from 'moment'

class Workout extends React.Component {
  render () {
    const { loading, viewer } = this.props

    if (loading) {
      return <p>Please wait ... </p>
    }

    if (has(viewer, 'allWorkouts.edges[0]')) {
      const workout = viewer.allWorkouts.edges[0].node
      return (
        <CardText key={`workout-0`}>
          <div className="workout-header">
            <Chip
              onTouchTap={() =>
                this.context.router.push(
                  `/?workoutId=${workout.id}&parkId=${workout.parkId}`
                )}
              className="chip"
            >
              Back to Workout list
            </Chip>
            <Chip
              onTouchTap={() =>
                this.context.router.push(
                  `/profile/${workout.Workout.username}`
                )}
              className="chip"
            >
              <Avatar
                src={workout.Workout.picture}
                onClick={() =>
                  this.context.router.push(
                    `/profile/${workout.Workout.username}`
                  )}
              />
              <span>{workout.Workout.nickname}</span>
            </Chip>
            <div className="workout-title">
              {workout.title || 'N/A'}
              <i className="fa fa-pencil edit-icon" />
            </div>
          </div>
          <div className="workout-date">
            {workout.date
              ? moment(workout.date).format('ddd MMM Do YYYY')
              : 'N/A'}
            {' '}
            {workout.time ? moment(workout.time).format('LT') : 'N/A'}
          </div>
          <div className="workout-description">
            {workout.description}
          </div>
          <div className="button-container">
            <RaisedButton
              backgroundColor={'#1F01B9'}
              labelColor={'white'}
              label="RSVP"
              className="rsvp-button"
              onTouchTap={() => console.warn("RSVP'ing to this Place")}
            />
            <div
              className="share-button"
              onClick={() => console.warn('Sharing to this Place')}
            >
              <span>Share</span>
              <i className="fa fa-share share-icon" />
            </div>
          </div>
        </CardText>
      )
    } else {
      return <p> No such workout. Please try later. </p>
    }
  }
}

Workout.propTypes = {
  loading: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
}

Workout.contextTypes = {
  router: PropTypes.object.isRequired,
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
