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
      const RSVPCount = workout.RSVPsForWorkout.edges.length

      return (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
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
              <div className="__workout__image__container">
                <img
                  width="100%"
                  src={workout.pictureURL}
                  onClick={() => this.handleWorkoutClick(workout)}
                />
                <div className="__workout__information">
                  <div>
                    <span>
                      {moment(workout.startDateTime).format(
                        'ddd MMM Do, YYYY h:mm a'
                      )}
                      -
                      {moment(workout.endDateTime).format('LT')}
                    </span>
                    <br />
                    <br />
                    {Boolean(RSVPCount) && <span>RSVPed: {RSVPCount}</span>}
                  </div>
                  <div><i className="fa fa-share __share__icon" /></div>
                </div>
              </div>
              {workout.description &&
                <div className="__description_container">
                  <div><b>Description</b></div>
                  <div>{workout.description}</div>
                </div>}
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
        </div>
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
