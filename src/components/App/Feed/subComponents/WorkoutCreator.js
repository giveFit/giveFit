import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
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
        description,
        recurring,
        parkId
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
      date: null
    };
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
  }

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
    console.log("submitWorkout props", this.props)
    if(e){
      e.preventDefault();
    }
    const that = this;
    this.props.createWorkout({
      title: this.state.title,
      description: this.state.description,
      date: this.state.date,
      recurring: this.state.recur,
      parkId: this.props.data.googleData.parkId ? this.props.data.googleData.parkId : undefined,
    }).then(({data}) => {
      console.log('submitWorkout data', data)
      that.setState({
        open: false,
        recur: true,
        title: undefined,
        description: undefined,
        date: null
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
)(WorkoutCreator);

export default WorkoutCreatorWithData;

/*export default graphql(CreateChannelQuery, {
  props: ({ mutate }) => ({
    createChannel: (channel) => mutate({ variables: { channel: channel }})
  })
})(CreateChannel);*/