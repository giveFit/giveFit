import React, { PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import { Avatar, Chip } from 'material-ui';
//svg-icons
import BookmarkBorder from 'material-ui/svg-icons/action/bookmark-border';
import Done from 'material-ui/svg-icons/action/done';
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center';
import DatePicker from 'material-ui/DatePicker';
import Comment from 'material-ui/svg-icons/communication/comment';
import {blue500, red500, greenA200, white} from 'material-ui/styles/colors';

//Local components
import WorkoutCreator from './WorkoutCreator';

//styles module
import styles from '../styles.module.css';

const inlineStyles = {
  subtitleStyle: {
    subtitleColor: 'rgba(211, 211, 211)'
  },
  chip: {
    margin: 4,
  }
};

class GymFeed extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      expanded: false
    };
  }
  componentWillReceiveProps(newProps){
    if(newProps.active !== this.props.active && newProps.active === true){
       console.log('i m now active', this.props.data.title);
       const element = findDOMNode(this.refs.root);
       //Scrolls the current element into the visible area of the browser
       element.scrollIntoView({block: "end", behavior: "smooth"});
    }
  }
  handleExpand(){
    this.setState({expanded: true});
    console.log('expanded')
  }
  handleReduce(){
    this.setState({expanded: false});
    console.log('reduced')
  }
  handleSave(){
    alert('hey saving')
    //add a mutation here to save to the user's "saved workouts"
  }
  //handleOpen of WorkoutCreator
  handleOpen(){
    console.log('handling open')
    this.setState({open: true});
  };
  //handleClose of WorkoutCreator
  handleClose(){
    this.setState({open: false});
  };
  render(){
    const {props} = this;
    //console.log('feed props', props)
    return <Card ref='root' key={props.data.id} className={props.active ? styles.cardActive : ""}>
      <CardHeader
        title={props.data.googleData.title}
        //avatar={props.data.avatar}
      />
      <CardMedia
        overlay={
          <CardTitle
            title={props.data.googleData.rating > 0 ? <div> Rating: {props.data.googleData.rating} </div>: <div></div>}
            subtitle={
              <div> Save:
                <BookmarkBorder 
                  color={white} 
                  hoverColor={greenA200}
                  onClick={this.handleSave.bind(this)}
                />
              </div>
            }
          />
        }
      >
        {props.data.googleData.photos ? <img src={props.data.googleData.photos} className={styles.img}/> : <img src="http://lorempixel.com/400/200" />}
      </CardMedia>
      <CardText>
        {props.data.rating ? <div> Rating: &nbsp {props.data.rating} </div>: <div></div>}
      </CardText>
      <CardText>
        Is this your gym or studio? Claim it here!
      </CardText>
      <Card expanded={this.state.expanded}>
      <CardText expandable={true}>
      <Tabs >
          <Tab label="Workouts">
           <div>
            <WorkoutCreator /> 
           </div>
          </Tab>
          <Tab label="Comments" >
           <div>
             <div>
               <TextField hintText="Add a comment"/>
               <Comment />
             </div>
           </div>
          </Tab>
          </Tabs>
      </CardText>
      </Card>
     {/* <CardText>
        <div>Comments</div>
      </CardText>*/}
      <CardActions >
      {this.state.expanded ? <FlatButton label="Reduce" onTouchTap={this.handleReduce.bind(this)} /> : <FlatButton label="See more workouts" onTouchTap={this.handleExpand.bind(this)} /> } 
      </CardActions>
    </Card>
  }
}

export default GymFeed;
