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
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'

const inlineStyles = {
  listStyle: {
    'list-style-type': 'none'
  }
}

class GroupCreator extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      expanded: false,
      recur: true,
      title: undefined,
      contentSnippet: undefined
    };
    this._handleTitleChange = this._handleTitleChange.bind(this);
    this._handleDescriptionChange = this._handleDescriptionChange.bind(this);
    //this._handleLocation = this._handleLocation.bind(this);
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
    this.setState({
      open: false
    });
    console.log('closed');
    this.props.createWorkoutGroup({
      title: this.state.title,
      contentSnippet: this.state.contentSnippet,
      lat: 39.283402,
      lng: -76.612912,
      image: "http://dummyimage.com/116x155.jpg/cc0000/ffffff",
    }).then(({ data }) => {
      console.log("data", data)
    }).catch((error) => {
      console.error('error in form', error)
    });
  };
  //reference https://scotch.io/tutorials/handling-file-uploads-painlessly-with-filepicker
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
  };
  _handleTitleChange(e){
    this.state.title = e.target.value;
  };
  _handleDescriptionChange(e){
    this.state.contentSnippet = e.target.value;
  };
  /*_handleLocation(e){
    this.state.location = {

    }
  }*/
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
                  hintText="Group Title"
                  name="groupTitle"
                  onChange={this._handleTitleChange}
                />
              </li>
              <li>
                <TextField 
                  hintText="Group description"
                  name="groupName"
                  onChange={this._handleDescriptionChange}
                />
              </li>
              <li>
                <TextField 
                  id="autocomplete" 
                  onTouchTap={this.handleAutoComplete.bind(this)}
                  //onChange={this._handleLocation}
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

//I want to tie the workout group to a user
const CREATE_WORKOUT_GROUP = gql`
  mutation CreateWorkoutGroup($data: CreateWorkoutGroupInput!) {
  createWorkoutGroup(input:$data){
    changedWorkoutGroup{
      title,
      contentSnippet,
      lat,
      lng,
      image
    }
  }
}
`;

const GroupCreatorWithData = graphql(CREATE_WORKOUT_GROUP, {
  props: ({ mutate }) => ({
    createWorkoutGroup: (data) => mutate({
      variables: {
        data,
      },
    }),
  }),
})(GroupCreator);

export default GroupCreatorWithData;





