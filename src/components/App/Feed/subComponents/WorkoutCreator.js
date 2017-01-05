import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center';
import Toggle from 'material-ui/Toggle';

export default class WorkoutCreator extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      recur: true
    };
  }

  handleOpen(){
    console.log('handling open')
    this.setState({open: true});
  };
  handleToggle(event, toggled){
    this.setState({
      [event.target.name]: toggled,
    });
  }
  handleClose(){
    this.setState({open: false});
  };
  addWorkout(){
    alert('adding workout')
  }
  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
    ];

    return (
      <div>
        <RaisedButton 
          label="Post a workout to the group" 
          labelPosition="before"
          onTouchTap={this.handleOpen.bind(this)}
          icon={<FitnessCenter />}
        />
        <Dialog
          title="Get in the mix by adding a workout"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
          <TextField hintText="Workout Title"/>
          <TextField hintText="Description"/>
          <DatePicker hintText="Select a date" /> 
          <Toggle
            name="recur"
            value="recur"
            label="Recurring?"
            toggled={this.state.recur}
            onToggle={this.handleToggle.bind(this)}
          />
        </Dialog>
      </div>
    );
  }
}