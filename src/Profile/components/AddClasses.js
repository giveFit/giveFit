import React from 'react'
import PropTypes from 'prop-types'
import { graphql, withApollo } from 'react-apollo'
import slugify from 'slugify'
import moment from 'moment'

import { CREATE_WORKOUT } from '../gql'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import AutoForm from './fields/SimpleForm'
import WorkoutLocation from './fields/workoutLocation'
import FieldTitle from './fields/title'
import FieldType from './fields/type'
import FieldPictureURL from 'components/UploadPicture'
import FieldDate from './fields/Date'
import FieldStartTime from './fields/StartTime'
import FieldEndTime from './fields/EndTime'
import FieldRequestTrainer from './fields/requestTrainer'
import FieldDescription from './fields/description'
import FieldEmail from './fields/email'
import FieldRecurring from './fields/recurring'
import FieldNoRecurring from './fields/noRecurring'
import FieldPublic from './fields/Public'

import AuthService from 'utils/AuthService'

import './AddClasses.css'

class AddClasses extends React.Component {
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
      recurringWeeks: 0,
      errors: {},
      indexedParks: null,
      places: [],
      date: new Date(),
      location: null,
      workoutLocation: '',
    }

    this.auth = new AuthService(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)

    this.centerLatLng = null

    this.centerLatLng = {
      lat: 39.2904,
      lng: -76.6122,
    }
  }

  onChangeMap (address, id, lat, lng) {
    this.setState({
      workoutAddress: address.address,
      parkId: address.parkId,
      lat: address.lat,
      lng: address.lng,
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
      recurringWeeks,
      workoutLocation,
      workoutAddress,
    } = this.state

    // @todo: consider replacing this random number with uuid: https://github.com/makeable/uuid-v4.js
    var randomSlugNumber = Math.floor(Math.random() * 10000).toString()
    var titleAndSlugString = title.concat(' ', randomSlugNumber)
    var slug = slugify(titleAndSlugString).toLowerCase()

    if (parkId) {
      _geoloc.lng = this.state.lat
      _geoloc.lat = this.state.lng
    }

    if (date && startDateTime && endDateTime) {
      startDateTime = new Date(
        date.getFullYear(), date.getMonth(), date.getDate(),
        startDateTime.getHours(), startDateTime.getMinutes(),
      )

      endDateTime = new Date(
        date.getFullYear(), date.getMonth(), date.getDate(),
        endDateTime.getHours(), endDateTime.getMinutes(),
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
      recurringWeeks,
      _geoloc,
      slug,
      workoutLocation,
      workoutAddress,
      // workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      workoutId: JSON.parse(window.localStorage.getItem('scapholdUserId')),
    })
      .then(({ data }) => {
        console.log('data', data)
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
          slug: null,
          workoutLocation: '',
          workoutAddress: '',
        })
      }).catch((error) => {
        console.error(error)

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

  render () {
    return (
      <div>
        <div className='top_level_container'>
          <div className='title_and_type_container'>
            <FieldTitle onChange={(title) => this.setState({ title })} errorText={this.state.errors.title} />
            <FieldType onChange={(type) => this.setState({ type })} value={this.state.type} errorText={this.state.errors.type} />
          </div>
        </div>

        <div className='add_picture_container'>
          <FieldPictureURL onChange={(pictureURL) => this.setState({ pictureURL }) } errorText={this.state.errors.pictureURL} />
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
        </div>
        <FieldDescription
          onChange={(description) => this.setState({ description })}
          errorText={this.state.errors.description}
        />
        <FieldPublic />
        <AutoForm
          onChange={(address, parkId, lat, lng) => this.onChangeMap({ address, parkId, lat, lng })}
        />
        <WorkoutLocation
          onChange={workoutLocation => this.setState({ workoutLocation })}
        />
        <div>
          <FieldRecurring
            onCheck={() => this.setState({ recurring: !this.state.recurring })}
            recurring={this.state.recurring}
            errorText={this.state.errors.description}
          />
          {
            this.state.recurring &&
            <FieldNoRecurring
              onChange={(recurringWeeks) => this.setState({ recurringWeeks })}
              value={this.state.recurringWeeks}
              errorText={this.state.errors.noRecurring}
            />
          }
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
        {/* Need a way to refresh the page/direct you to your new workout?
        toast + reset the fields?  */}
        <FlatButton
          key='loggedInDialog'
          label='Submit'
          primary
          keyboardFocused
          onTouchTap={() => this.createWorkout()}
        />
      </div>
    )
  }
}

AddClasses.propTypes = {
  profile: PropTypes.object,
  createWorkout: PropTypes.func.isRequired,
}

const AddClassesWithData = withApollo(graphql(CREATE_WORKOUT, {
  props ({ ownProps, mutate }) {
    return {
      createWorkout ({title, type, startDateTime, endDateTime, description, requestTrainer, pictureURL, parkId, userEmail, recurring, _geoloc, slug, workoutId, recurringWeeks, workoutAddress, workoutLocation}) {
        var input = {
          title: title,
          type: type,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          description: description,
          requestTrainer: requestTrainer,
          pictureURL: pictureURL,
          parkId: parkId,
          userEmail: userEmail,
          recurring: recurring,
          recurringWeeks: recurringWeeks,
          _geoloc: _geoloc,
          slug: slug,
          workoutId: workoutId,
          workoutAddress: workoutAddress,
          workoutLocation: workoutLocation,
        }
        if (recurring === true) {
          try {
            for (var i = 0; i < recurringWeeks - 1; i++) {
              mutate({
                // assign a new start/endDateTime to each new iteration
                variables: {
                  input: {
                    ...input,
                    startDateTime: moment(startDateTime).clone().add(i, 'week').toDate(),
                    endDateTime: moment(endDateTime).clone().add(i, 'week').toDate(),
                  },
                },
              })
            }
          } finally {
            // eslint-disable-next-line no-unsafe-finally
            return mutate({
              // assign a new start/endDateTime to each new iteration
              variables: {
                input: {
                  ...input,
                  startDateTime: moment(startDateTime).clone().add(recurringWeeks - 1, 'week').toDate(),
                  endDateTime: moment(endDateTime).clone().add(recurringWeeks - 1, 'week').toDate(),
                },
              },
            })
          }
        } else {
          return mutate({
            variables: { input: input },
          })
        }
      },
    }
  },
})(AddClasses))

export default AddClassesWithData
