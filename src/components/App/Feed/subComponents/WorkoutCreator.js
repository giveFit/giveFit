import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import Checkbox from 'material-ui/Checkbox'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Datetime from 'react-datetime'
import ReactFilepicker from 'react-filepicker'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import apolloConfig from '../../../../../apolloConfig'
import configKeys from '../../../../../configKeys'
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
      userProfile: {}
    }

    this.places = []

    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain)
  }

  componentDidMount () {
    const scapholdUser = window.localStorage.getItem('scapholdUserId') ? this.auth.getLoggedInUser() : null
    const userProfile = JSON.parse(window.localStorage.getItem('user_profile'))

    this.places = Object.keys(this.props.indexedPlaces).map((placeID) => {
      const place = this.props.indexedPlaces[placeID].googleData

      return {
        title: place.title,
        id: place.parkId
      }
    })

    this.setState({
      scapholdUser,
      userProfile
    })
  }

  handleOpen () {
    this.setState({ open: true })
  }

  // event requestTrainer?
  handleToggle (event, toggled) {
    this.setState({
      [event.target.name]: toggled
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
      // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      workoutId: this.state.scapholdUser
    }).then(({data}) => {
      this.setState({
        open: false,
        requestTrainer: true,
        title: undefined,
        type: undefined,
        description: undefined,
        pictureURL: undefined,
        date: null,
        time: null
      })
    }).catch((error) => {
      console.error('error in form', error)
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
      date
    })
  }

  onTimeChange (event, time) {
    this.setState({
      time
    })
  }

  onLocationChange (parkId) {
    this.setState({
      parkId
    })
  }

  handleStartTime (moment) {
    this.setState({
      startDateTime: moment.toDate()
    })
  }
  handleEndTime (moment) {
    this.setState({
      endDateTime: moment.toDate()
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
            />
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
          />
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
              // style={inlineStyles.chip}
            >
              <Avatar
                src={this.state.userProfile.picture}
                onClick={() => this.context.router.push('/profile')}
              />
              {this.state.userProfile.nickname}
            </Chip>
          </div>

          <div className='title_and_type_container'>
            <TextField
              id='workout_title'
              hintText='Workout Title'
              onChange={(e) => this.onTitleChange(e.target.value)}
            />
            <SelectField
              floatingLabelText='Type'
              value={this.state.type}
              onChange={(e, index, value) => this.onTypeChange(value)}
            >
              <MenuItem value={'Walk'} primaryText='Walk' />
              <MenuItem value={'Yoga'} primaryText='Yoga' />
              <MenuItem value={'Bootcamp'} primaryText='Bootcamp' />
              <MenuItem value={'Zumba'} primaryText='Zumba' />
              <MenuItem value={'Dance'} primaryText='Dance' />
            </SelectField>
          </div>
        </div>

        <div className='add_picture_container'>
          <ReactFilepicker
            apikey={configKeys.FILESTACK_API}
            options={{
              mimetype: 'image/*',
              services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX']
            }}
            buttonText={`<span><i class='fa fa-plus-circle'></i> Add Picture</span>`}
            onSuccess={(res) => this.handlePictureChange(res.url)}
            buttonClass='add_picture_button'
          />
          {this.state.pictureURL &&
            <img
              src={this.state.pictureURL}
              className='workout_picture'
            />
          }
        </div>

        <div className='time_and_location_container'>
          <div className='start-time'>
            <span> Pick a Start Time <i className='fa fa-clock-o' /></span>
            <Datetime
              onChange={(moment) => this.handleStartTime(moment)}
              className='date-time'
            />
          </div>
          <div className='end-time'>
            <span> Pick an End Time <i className='fa fa-clock-o' /></span>
            <Datetime
              onChange={(moment) => this.handleEndTime(moment)}
              className='date-time'
            />
          </div>
          <div>
            <span> Choose Location <i className='fa fa-map-marker' /></span>
            <SelectField
              fullWidth
              value={this.state.parkId}
              onChange={(e, index, value) => this.onLocationChange(value)}
            >
              {this.places.map((place) => <MenuItem value={place.id} primaryText={place.title} />)}
            </SelectField>
          </div>
        </div>

        <Checkbox
          name='requestTrainer'
          label='Request Trainer for this activity'
          className='request_trainer'
          checked={this.state.requestTrainer}
          onCheck={() => this.handleRequestTrainerToggle()}
        />

        <TextField
          id='workout_description'
          hintText='Optional Description'
          onChange={(e) => this.onDescriptionChange(e.target.value)}
        />
      </Dialog>
    )
  }

  render () {
    return (
      <div>
        <RaisedButton
          label={<i
            className='fa fa-plus'
            style={{ color: '#75F0BA', fontWeight: 'bold' }}
          >
             Add Activity
          </i>}
          labelPosition='before'
          backgroundColor={'white'}
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
      createWorkout: (input) => mutate({ variables: { input: input } })
    })
  }),
  graphql(LOGGEDIN_USER_QUERY, {
    props: ({ data }) => ({
      loggedInUser: data.viewer ? data.viewer.user : null
    })
  })
)(WorkoutCreator)

export default WorkoutCreatorWithData
