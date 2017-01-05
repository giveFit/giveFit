import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import GroupAdd from 'material-ui/svg-icons/social/group-add';
import Toggle from 'material-ui/Toggle';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Comment from 'material-ui/svg-icons/communication/comment';
import WorkoutPost from './WorkoutPost';
import WorkoutCreator from './WorkoutCreator';
import {Tabs, Tab} from 'material-ui/Tabs';
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo';

const inlineStyles = {
  listStyle: {
    'list-style-type': 'none'
  }
}

export default class GroupCreator extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      expanded: false,
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
  addImage(){
    alert(event.fpfile.url)
  }
  handleReduce(){
    this.setState({expanded: false});
    console.log('reduced')
  }
  handleExpand(){
    this.setState({expanded: true});
    console.log('expanded')
  }
  //Needs to be looked at
  handleAutoComplete(){
    new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')), {
        types: ['geocode']
    });
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
      //Need to improve styling a lot here
      <div>
      <script type="text/javascript" src="//api.filestackapi.com/filestack.js"></script>
        <RaisedButton 
          label="Create a workout group" 
          labelPosition="before"
          onTouchTap={this.handleOpen.bind(this)}
          icon={<GroupAdd />}
        />
        <Dialog
          title="Add your own awesome group"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
         <Card>
            <ul className={inlineStyles.listStyle}>
              <li>
                <TextField 
                  hintText="Group Name"
                  name="groupName"
                />
              </li>
              <li>
                <TextField 
                  hintText="Group description"
                  name="groupName"
                />
              </li>
              <li>
                <TextField 
                  id="autocomplete" 
                  onTouchTap={this.handleAutoComplete.bind(this)}
                />
              </li>
          </ul>
          {/*<RaisedButton 
            label="Add an Image"
            type="filepicker"
            onTouchTap={this.addImage.bind(this)}
            icon={<AddAPhoto/>}
          />
          <input type="filepicker" data-fp-apikey="AqoZLyjES7m7e3lO4h8ZFz" onChange={alert(event.fpfile.url)}/>*/}
         </Card>
        </Dialog>
      </div>
    );
  }
}