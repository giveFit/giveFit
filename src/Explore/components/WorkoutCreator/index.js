import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import FieldTitle from './fields/title'
import FieldType from './fields/type'
import FieldPictureURL from './fields/pictureURL'
import FieldStartDateTime from './fields/StartDateTime'
import FieldEndDateTime from './fields/EndDateTime'
import FieldLocation from './fields/location'
import FieldRequestTrainer from './fields/requestTrainer'
import FieldDescription from './fields/description'
import FieldEmail from './fields/email'

import AuthService from 'utils/AuthService'

import 'react-datetime/css/react-datetime.css'
import './styles.css'

const CREATE_WORKOUT = gql`
  mutation CreateWorkout($input: CreateWorkoutInput!) {
    createWorkout(input: $input){
      changedWorkout{
        title,
        type,
        startDateTime,
        endDateTime,
        description,
        requestTrainer,
        parkId,
        pictureURL,
        userEmail,
        Workout{
          nickname,
          username,
          picture
        }
      }
    }
  }
`

const LOGGEDIN_USER_QUERY = gql`
  query LoggedInUser{
    viewer{
      user{
        id
        username
        nickname
      }
    }
  }
`
// I'll want to create a subscription here, as well as putting through
// a groupId to match with whichever group the data is being submitted on
class WorkoutCreator extends React.Component {
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
      userProfile: {},
      errors: {},
    }

    this.places = []

    this.auth = new AuthService(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
  }

  componentDidMount () {
    console.log('indexedPlaces', this.props.indexedPlaces)
    const scapholdUser = window.localStorage.getItem('scapholdUserId') ? this.auth.getLoggedInUser() : null
    const userProfile = JSON.parse(window.localStorage.getItem('user_profile'))
    console.log('userProfile')

    this.places = Object.keys(this.props.indexedPlaces).map((placeID) => {
      const place = this.props.indexedPlaces[placeID].googleData

      return {
        title: place.title,
        id: place.parkId,
      }
    })

    this.setState({
      scapholdUser,
      userProfile,
    })
  }

  handleOpen () {
    this.setState({ open: true })
  }

  // event requestTrainer?
  handleToggle (event, toggled) {
    this.setState({
      [event.target.name]: toggled,
    })
  }

  handleClose () {
    this.setState({open: false})
  }

  createWorkout () {
    this.props.createWorkout({
      title: this.state.title,
      type: this.state.type,
      startDateTime: this.state.startDateTime,
      endDateTime: this.state.endDateTime,
      description: this.state.description,
      requestTrainer: this.state.requestTrainer,
      pictureURL: this.state.pictureURL,
      parkId: this.state.parkId,
      userEmail: this.state.userEmail,
      // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      workoutId: this.state.scapholdUser,
    }).then(({data}) => {
      this.setState({
        open: false,
        requestTrainer: undefined,
        title: undefined,
        type: undefined,
        description: undefined,
        pictureURL: undefined,
        userEmail: undefined,
        startDateTime: null,
        endDateTime: null,
        parkId: null,
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

  onTitleChange (title) {
    this.setState({ title })
  }

  onTypeChange (type) {
    this.setState({ type })
  }

  handlePictureChange (pictureURL) {
    this.setState({ pictureURL })
  }

  handleRequestTrainerToggle () {
    this.setState({ requestTrainer: !this.state.requestTrainer })
  }

  onDescriptionChange (description) {
    this.setState({ description })
  }

  onDateChange (event, date) {
    this.setState({
      date,
    })
  }

  onTimeChange (event, time) {
    this.setState({
      time,
    })
  }

  onLocationChange (parkId) {
    this.setState({
      parkId,
    })
  }

  handleStartDateTime (moment) {
    this.setState({
      startDateTime: moment.toDate(),
    })
  }

  handleEndDateTime (moment) {
    this.setState({
      endDateTime: moment.toDate(),
    })
  }

  handleUserEmailChange (userEmail) {
    this.setState({
      userEmail,
    })
  }

  notLoggedInDialog () {
    return (
      <div>
        <Dialog
          title='Please Login to add an activity'
          actions={[
            <FlatButton
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
            label='Ok'
            primary
            keyboardFocused
            onTouchTap={() => this.createWorkout()}
          />,
        ]}
        autoScrollBodyContent
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose.bind(this)}
      >
        <div className='top_level_container'>
          <div className='profile_chip_container'>
            <Chip
              className='profile_chip'
              onTouchTap={() => this.context.router.push('/profile')}
            >
              <Avatar
                src={this.state.userProfile.picture}
                onClick={() => this.context.router.push('/profile')}
              />
              {this.state.userProfile.nickname}
            </Chip>
          </div>

          <div className='title_and_type_container'>
            <FieldTitle onChange={(value) => this.onTitleChange(value)} errorText={this.state.errors.title} />
            <FieldType onChange={(value) => this.onTypeChange(value)} value={this.state.type} errorText={this.state.errors.type} />
          </div>
        </div>

        <div className='add_picture_container'>
          <FieldPictureURL onChange={(url) => this.handlePictureChange(url)} errorText={this.state.errors.pictureURL} />
          {this.state.pictureURL &&
            <img
              src={this.state.pictureURL}
              className='workout_picture'
            />
          }
        </div>

        <div className='time_and_location_container'>
          <FieldStartDateTime onChange={(moment) => this.handleStartDateTime(moment)} errorText={this.state.errors.startDateTime} />
          <FieldEndDateTime onChange={(moment) => this.handleEndDateTime(moment)} errorText={this.state.errors.endDateTime} />
          <FieldLocation
            onChange={(value) => this.onLocationChange(value)}
            places={this.places}
            parkId={this.state.parkId}
            errorText={this.state.errors.parkId}
          />
        </div>

        <div className='request-trainer-container'>
          <FieldRequestTrainer
            onCheck={() => this.handleRequestTrainerToggle()}
            requestTrainer={this.state.requestTrainer}
            errorText={this.state.errors.requestTrainer}
          />

          {this.state.requestTrainer &&
            <FieldEmail onChange={(value) => this.handleUserEmailChange(value)} errorText={this.state.errors.email} />
          }
        </div>

        <FieldDescription onChange={(value) => this.onDescriptionChange(value)} errorText={this.state.errors.description} />
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
        {this.auth.loggedIn()
          ? this.loggedInDialog()
          : this.notLoggedInDialog()
        }
      </div>
    )
  }
}

const WorkoutCreatorWithData = compose(
  graphql(CREATE_WORKOUT, {
    props: ({ mutate }) => ({
      createWorkout: (input) => mutate({ variables: { input: input } }),
    }),
  }),
  graphql(LOGGEDIN_USER_QUERY, {
    props: ({ data }) => ({
      loggedInUser: data.viewer ? data.viewer.user : null,
    }),
  })
)(WorkoutCreator)

export default WorkoutCreatorWithData
