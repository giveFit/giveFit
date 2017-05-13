import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import { GET_THROUGH_VIEWER } from './gql'

import GridContainer from './GridContainer'

import './styles.css'

class App extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      profile: null,
      token: null,
      user: null,
      loggedInToolbar: false,
    }
  }

  render () {
    const { profile } = this.props
    let latLng = null

    if (this.props.location.query.lat && this.props.location.query.lng) {
      latLng = {
        lat: parseFloat(this.props.location.query.lat),
        lng: parseFloat(this.props.location.query.lng),
      }
    }

    return (
      <div>
        <GridContainer
          latLng={latLng}
          onPlaceSelect={(place) => {
            this.props.data.refetch({
              latLng: place.address,
            })

            return null
          }}
          profile={profile}
          user={this.state.user}
          workoutGroups={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []}
          workouts={(!this.props.data.loading && this.props.data.viewer.allWorkouts.edges) ? this.props.data.viewer.allWorkouts.edges : []}
          markers={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges)
            ? this.props.data.viewer.allWorkoutGroups.edges.map((i, index) => ({
              // title : i.node.title,
              position: {
                lat: parseFloat(i.node.lat),
                lng: parseFloat(i.node.lng),
              },
            }))
            : []
          }
        />
      </div>
    )
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
}

const AppWithData = compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({
      variables: { first: 8 },
    }),
  })
)(App)

export default AppWithData
