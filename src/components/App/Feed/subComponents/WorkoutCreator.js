import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Calendar from 'material-ui/DatePicker/Calendar';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center';
import Toggle from 'material-ui/Toggle';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import apolloConfig from '../../../../../apolloConfig';
import AuthService from 'utils/AuthService';

const CREATE_WORKOUT = gql`
  mutation CreateWorkout($input: CreateWorkoutInput!) {
    createWorkout(input: $input){
      changedWorkout{
        title,
        date,
        time,
        description,
        recurring,
        parkId,
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
/*I'll want to create a subscription here, as well as putting through 
a groupId to match with whichever group the data is being submitted on*/
class WorkoutCreator extends Component {
  constructor(props, context) {
    console.log('WorkoutCreator props', props);
    super(props, context);
    this.state = {
      open: false,
      recur: true,
      title: null,
      description: null,
      date: null,
      scapholdUser: null,
    };
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);  

  }
  /*componentDidMount(){
    var scapholdUser = localStorage.getItem('scapholdUserId') ? this.auth.getLoggedInUser() : null;
    this.setState({scapholdUser: scapholdUser});
    console.log('scapholdUser', scapholdUser)
    console.log('scapholdUser state', this.state.scapholdUser)
  }*/

  handleOpen(){
    console.log('handling open')
    this.setState({open: true});
  };
  //event recurring?
  handleToggle(event, toggled){
    this.setState({
      [event.target.name]: toggled,
    });
  }
  handleClose(){
    this.setState({open: false});
  };
  submitWorkout(e){
    //looking to see if we still have the userId being set in localStorage
    //This seems to happen if the JWT has not expired for current user, but scaphold can't find the "loggedInUser"
    var scapholdUser = localStorage.getItem('scapholdUserId') ? this.auth.getLoggedInUser() : null;
    console.log("submitWorkout props", this.props)
    console.log("submitWorkout scapholdUser local", scapholdUser)
    console.log("submitWorkout this", this)
    if(e){
      e.preventDefault();
    }
    const that = this;
    this.props.createWorkout({
      title: this.state.title,
      description: this.state.description,
      date: this.state.date,
      time: this.state.time,
      recurring: this.state.recur,
      parkId: this.props.data.googleData.parkId ? this.props.data.googleData.parkId : undefined,
      //workoutId is the id of the loggedInUser, allowing us to make a connection in our data graph
      workoutId: this.props.loggedInUser ? this.props.loggedInUser.id : scapholdUser,
    }).then(({data}) => {
      console.log('submitWorkout data', data)
      that.setState({
        open: false,
        recur: true,
        title: undefined,
        description: undefined,
        date: null,
        time: null
      })
    }).catch((error) =>{
      console.error('error in form', error)
    })
  }
  onTitleChange(event){
    this.setState({
      title: event.target.value
    })
  };
  onDateChange(event, date){
    this.setState({
      date: date
    })
  };
  onTimeChange(event, time){
    this.setState({
      time: time
    })
  };
  onDescriptionChange(event){
    this.setState({
      description: event.target.value
    })
  };
  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.submitWorkout.bind(this)}
      />,
    ];
    return (
      <div>
        <div>
        <RaisedButton 
          label="Post an activity" 
          labelPosition="before"
          onTouchTap={this.handleOpen.bind(this)}
          icon={<FitnessCenter />}
        />
        </div>
        {
         !this.auth.loggedIn() ? 
          <div>
            <Dialog
              title="Please Login to add an activity"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.submitWorkout.bind(this)}
            >
            </Dialog>
          </div> :
          <div>
            <Dialog
              title="Get in the mix by adding a workout"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose.bind(this)}
            >
              <TextField 
                id="text-field-controlled" 
                hintText="Workout Title"
                onChange={this.onTitleChange.bind(this)}
              />
              <TextField 
                id="text-field-controlled"
                hintText="Description" 
                onChange={this.onDescriptionChange.bind(this)}
                
              />
              <DatePicker 
                id="text-field-controlled"
                hintText="Select a date" 
                onChange={this.onDateChange.bind(this)}
              />
              <TimePicker
                hintText="Select a time"
                onChange={this.onTimeChange.bind(this)}
              /> 
              <Toggle
                name="recur"
                value="recur"
                label="Recurring?"
                toggled={this.state.recur}
                onToggle={this.handleToggle.bind(this)}
              />
            </Dialog>
        </div>
        }
      </div>
    );
  }
}

const WorkoutCreatorWithData = compose(
  graphql(CREATE_WORKOUT, {
    props: ({ mutate }) => ({
      createWorkout: (input) => mutate({ variables: { input: input } })
    }),
  }),
  graphql(LOGGEDIN_USER_QUERY, {
    props: ({ data }) => ({
       loggedInUser: data.viewer ? data.viewer.user : null 
    })
  }),
)(WorkoutCreator);

export default WorkoutCreatorWithData;
