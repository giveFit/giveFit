import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import { CREATE_WORKOUT, LOGGEDIN_USER_QUERY } from './gql'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import FieldTitle from './fields/title'
import FieldType from './fields/type'
import FieldPictureURL from './fields/pictureURL'
import FieldDate from './fields/Date'
import FieldStartTime from './fields/StartTime'
import FieldEndTime from './fields/EndTime'
import FieldLocation from './fields/location'
import FieldRequestTrainer from './fields/requestTrainer'
import FieldDescription from './fields/description'
import FieldEmail from './fields/email'
import FieldRecurring from './fields/recurring'

import AuthService from 'utils/AuthService'

import './styles.css'

// I'll want to create a subscription here, as well as putting through
// a groupId to match with whichever group the data is being submitted on
class AddActivity extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      title: null,
      type: null,
      startDateTime: null,
      endDateTime: null,
      description: null,
      pictureURL: null,
      requestTrainer: false,
      parkId: null,
      open: false,
      scapholdUser: null,
      userEmail: null,
      recurring: false,
      errors: {},
      date: new Date(),
    }

    this.places = []

    this.auth = new AuthService(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
  }

  componentDidMount () {
    this.places = Object.keys(this.props.indexedParks).map((placeID) => {
      const place = this.props.indexedParks[placeID]

      return {
        title: place.title,
        id: place.parkId,
        _geoloc: place.position,
      }
    })
  }

  createWorkout () {
    const _geoloc = {}
    let {
      title,
      type,
      date,
      startDateTime,
      endDateTime,
      description,
      requestTrainer,
      pictureURL,
      parkId,
      userEmail,
      recurring,
    } = this.state

    if (parkId) {
      _geoloc.lng = this.props.indexedParks[parkId].position.lng
      _geoloc.lat = this.props.indexedParks[parkId].position.lat
    }

    if (date && startDateTime && endDateTime) {
      startDateTime = new Date(
        date.getFullYear(), date.getMonth(), date.getDate(),
        startDateTime.getHours(), startDateTime.getMinutes(),
      )

      endDateTime = new Date(
        date.getFullYear(), date.getMonth(), date.getDate(),
        startDateTime.getHours(), startDateTime.getMinutes(),
      )
    }
    this.props.createWorkout({
      title,
      type,
      startDateTime,
      endDateTime,
      description,
      requestTrainer,
      pictureURL,
      parkId,
      userEmail,
      recurring,
      _geoloc,
      // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      workoutId: JSON.parse(window.localStorage.getItem('scapholdUserId')),
    })
      .then(({ data }) => {
        console.log(data.createWorkout.changedWorkout)

        this.setState({
          open: false,
          requestTrainer: false,
          title: null,
          type: null,
          description: null,
          pictureURL: null,
          userEmail: null,
          startDateTime: null,
          endDateTime: null,
          parkId: null,
          recurring: false,
        })
      }).catch((error) => {
        console.log(error)

        const errors = error.toString().split('\n')

        for (let i = 1; i < errors.length; i++) {
          const fieldName = errors[i].split('"')[1]

          errors[fieldName] = 'This field is required'
        }

        this.setState({ errors })
      })
  }

  handleClose () {
    this.setState({ open: false })
  }

  handleOpen () {
    this.setState({ open: true })
  }

  notLoggedInDialog () {
    return (
      <div>
        <Dialog
          title='Please Login to add an activity'
          actions={[
            <FlatButton
              key='notLoggedInDialog'
              label='Ok'
              primary
              keyboardFocused
              onTouchTap={() => this.handleClose()}
            />,
          ]}
          modal={false}
          open={this.state.open}
          onRequestClose={() => this.handleClose()}
        />
      </div>
    )
  }

  loggedInDialog () {
    return (
      <Dialog
        style={{ zIndex: 0 }}
        actions={[
          <FlatButton
            key='loggedInDialog'
            label='Ok'
            primary
            keyboardFocused
            onTouchTap={() => this.createWorkout()}
          />,
        ]}
        autoScrollBodyContent
        modal={false}
        open={this.state.open}
        onRequestClose={() => this.handleClose()}
      >
        <div>
          <div className='top_level_container'>
            <div className='profile_chip_container'>
              <Chip
                className='profile_chip'
                onTouchTap={() => this.context.router.push('/profile')}
              >
                <Avatar
                  src={this.props.profile.picture }
                  onClick={() => this.context.router.push('/profile')}
                />
                {this.props.profile.nickname}
              </Chip>
            </div>

            <div className='title_and_type_container'>
              <FieldTitle onChange={(title) => this.setState({ title })} errorText={this.state.errors.title} />
              <FieldType onChange={(type) => this.setState({ type })} value={this.state.type} errorText={this.state.errors.type} />
            </div>
          </div>

          <div className='add_picture_container'>
            <FieldPictureURL onChange={(pictureURL) => this.setState({ pictureURL })} errorText={this.state.errors.pictureURL} />
            {this.state.pictureURL &&
              <img
                src={this.state.pictureURL}
                className='workout_picture'
              />
            }
          </div>

          <div className='time_and_location_container'>
            <FieldDate
              onChange={(date) => this.setState({ date })}
              errorText={this.state.errors.startDateTime}
            />
            <FieldStartTime
              onChange={(startDateTime) => this.setState({ startDateTime })}
              errorText={this.state.errors.startDateTime}
            />
            <FieldEndTime
              onChange={(endDateTime) => this.setState({ endDateTime })}
              errorText={this.state.errors.endDateTime}
            />
            <FieldLocation
              onChange={(parkId) => this.setState({ parkId })}
              places={this.places}
              parkId={this.state.parkId}
              errorText={this.state.errors.parkId}
            />
          </div>

          <div className='request-trainer-container'>
            <FieldRequestTrainer
              onCheck={() => this.setState({ requestTrainer: !this.state.requestTrainer })}
              requestTrainer={this.state.requestTrainer}
              errorText={this.state.errors.requestTrainer}
            />

            {this.state.requestTrainer &&
              <FieldEmail
                onChange={(userEmail) => this.setState({ userEmail })}
                errorText={this.state.errors.email}
              />
            }
          </div>

          <FieldDescription
            onChange={(description) => this.setState({ description })}
            errorText={this.state.errors.description}
          />
          <FieldRecurring
            onCheck={() => this.setState({ recurring: !this.state.recurring })}
            recurring={this.state.recurring}
            errorText={this.state.errors.description}
          />
        </div>
      </Dialog>
    )
  }

  render () {
    return (
      <div className='workout-creator'>
        <RaisedButton
          label={<i
            className='fa fa-plus'
            style={{ color: '#75F0BA', fontWeight: 'bold' }}
          >
             Add Activity
          </i>}
          className='add-activity'
          labelPosition='before'
          backgroundColor='#CE1F3C'
          onTouchTap={() => this.handleOpen()}
        />
        {this.auth.loggedIn() && this.props.profile
          ? this.loggedInDialog()
          : this.notLoggedInDialog()
        }
      </div>
    )
  }
}

AddActivity.propTypes = {
  indexedParks: PropTypes.object.isRequired,
  profile: PropTypes.object,
  workouts: PropTypes.array.isRequired,
}

const AddActivityWithData = compose(
  graphql(CREATE_WORKOUT, {
    props: ({ mutate }) => ({
      createWorkout: (input) => mutate({ variables: { input: input } }),
    }),
  })
)(AddActivity)

export default AddActivityWithData
