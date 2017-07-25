import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { graphql, compose } from 'react-apollo'
import BigCalendar from 'react-big-calendar'
import Dialog from 'material-ui/Dialog'
import { Tabs, Tab } from 'material-ui/Tabs'

import { GET_USER_WORKOUTS, UPDATE_USER_QUERY } from './gql'

// import ProfileDetails from './components/ProfileDetails'
import Event from './components/Event'
import AddClassesWithData from './components/AddClasses'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './styles.css'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

/* possible reference: https://github.com/scaphold-io/auth0-lock-playground */
class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      // editMode: false,
      userFieldsToUpdate: {},
      todaysDate: moment(),
      // user: null,
      events: [],
      eventDialogOpen: false,
      eventDialogInfo: {},
      error: null,
    }
  }

  componentWillReceiveProps (nextProps) {
    const events = []
    const parksDictionary = {}
    const { data } = nextProps

    // @todo: there should be a way where we can refresh the scpahold user token
    if (data.error) {
      this.props.auth.login()

      return
    }

    if (this.props.data.loading !== data.loading) {
      if (!data.getUser) {
        this.setState({
          error: true,
        })
      }

      const userWorkouts = data.getUser.Workout.edges
      const userWorkoutRSVPs = data.getUser.WorkoutRSVP.edges

      for (let i = 0; i < userWorkouts.length; i++) {
        const workout = userWorkouts[i].node

        parksDictionary[workout.parkId] = {}

        events.push({
          parkId: workout.parkId,
          description: workout.description,
          start: new Date(workout.startDateTime),
          end: new Date(workout.endDateTime),
          user: workout.Workout,
        })
      }

      for (let i = 0; i < userWorkoutRSVPs.length; i++) {
        const workout = userWorkoutRSVPs[i].node

        parksDictionary[workout.parkId] = {}

        events.push({
          parkId: workout.parkId,
          description: workout.description,
          rsvp: true,
          start: new Date(workout.startDateTime),
          end: new Date(workout.endDateTime),
          user: workout.Workout,
        })
      }
    }
  }

  onSaveProfileChanges () {
    this.props.updateUser({
      id: this.state.user.id,
      ...this.state.userFieldsToUpdate,
    })
      .then(() => {
        this.setState({
          user: { ...this.state.user, ...this.state.userFieldsToUpdate },
          editMode: false,
        })
      })
  }

  userFieldsToUpdate (fieldName, value) {
    this.setState({
      userFieldsToUpdate: { ...this.state.userFieldsToUpdate, [fieldName]: value },
    })
  }

  toggleEdit (editMode) {
    this.setState({ editMode, userFieldsToUpdate: {} })
  }

  prepareEventsForMobile (events) {
    return (
      <div className='events__mobile'>
        {events.map((event, index) => (
          <Event
            key={`event-${index}`}
            event={event}
          />
        ))}
      </div>
    )
  }

  render () {
    /* const { user, editMode, events, eventDialogInfo, eventDialogOpen, error } = this.state */
    const { events, eventDialogInfo, eventDialogOpen, error } = this.state

    if (error) {
      return (
        <div>
          <div>User does not exist...</div>
        </div>
      )
    }

    /* if (!user) {
      return (
        <div className='home'>
          <div>Loading...</div>
        </div>
      )
    } */

    return (
      <div className='home'>
        {/* <ProfileDetails
          description={this.state.userFieldsToUpdate.description || user.description }
          nickname={this.state.userFieldsToUpdate.nickname || user.nickname }
          picture={this.state.userFieldsToUpdate.picture || user.picture }
          editMode={editMode}
          onEnableEdit={(editMode) => this.toggleEdit(editMode)}
          onSaveProfileChanges={(...args) => this.onSaveProfileChanges(...args)}
          onUserDescriptionChange={(description) => this.userFieldsToUpdate('description', description)}
          onUserNicknameChange={(nickname) => this.userFieldsToUpdate('nickname', nickname)}
          onProfilePhotoChange={(url) => this.userFieldsToUpdate('picture', url)}
        /> */}
        {this.prepareEventsForMobile(events)}
        <Tabs>
          {/* <Tab label="Calendar">
            <BigCalendar
              events={events}
              defaultView='agenda'
              eventPropGetter={(event) => {
                return {
                  className: event.rsvp ? 'rsvpd' : '',
                }
              }}
              onSelectEvent={(event) => {
                this.setState({
                  eventDialogOpen: true,
                  eventDialogInfo: {
                    title: event.title,
                    location: event.location,
                    start: event.start,
                    end: event.end,
                    rsvp: Boolean(event.rsvp),
                  },
                })
              }}
            />
          </Tab> */}
          <Tab label="Add Activities">
            {/* looking at whether the user has a "PaidUser" connection, if not
            direct them to sign up...
            @todo: improve onboarding flow of new paid users */}
            <AddClassesWithData />
            {/* @todo: this section is working on permissions for who can and
            cannot add a workout */}
            {/* { this.props.data.getUser.PaidUserConnect
              ? <AddClassesWithData />
              : <div>
              Please email jake@givefit.net to access this feature
              </div>
            } */}
          </Tab>
        </Tabs>
        <Dialog
          title={eventDialogInfo.title}
          open={eventDialogOpen}
          onRequestClose={() => this.setState({ eventDialogOpen: false })}
        >
          <div><b>Location:</b> {eventDialogInfo.location}</div>
          <div><b>Start:</b> {moment(eventDialogInfo.start).format('LLLL')}</div>
          <div><b>End:</b> {moment(eventDialogInfo.end).format('LLLL')}</div>
        </Dialog>
      </div>
    )
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
}

const ProfileWithData = compose(
  graphql(GET_USER_WORKOUTS, {
    options: (props) => {
      return {
        variables: {
          id: props.params.id || JSON.parse(window.localStorage.getItem('scapholdUserId')),
          first: 10,
          where: {
            endDateTime: {
              gte: new Date().toString(),
            },
          },
          orderBy: {
            field: 'startDateTime',
            direction: 'ASC',
          },
        },
      }
    },
  }),
  graphql(UPDATE_USER_QUERY, {
    props: ({ mutate }) => ({
      updateUser: (user) => mutate({ variables: { user: user } }),
    }),
  }),
)(Profile)

export default ProfileWithData
