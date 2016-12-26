import React, { PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
//svg-icons
import BookmarkBorder from 'material-ui/svg-icons/action/bookmark-border';
import Done from 'material-ui/svg-icons/action/done';
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center';
import DatePicker from 'material-ui/DatePicker';
import Comment from 'material-ui/svg-icons/communication/comment';
import {blue500, red500, greenA200, white} from 'material-ui/styles/colors';


//styles module
import styles from '../styles.module.css';

const inlineStyles = {
  subtitleStyle: {
    subtitleColor: 'rgba(211, 211, 211)'
  }
};

class MainFeed extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      expanded: false,
      recur: true,
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
  addWorkout(){
    alert('adding workout')
  }
  handleToggle(event, toggled){
    this.setState({
      [event.target.name]: toggled,
    });
  }

  render(){
    const {props} = this;
    console.log('feed props', props)
    return <Card ref='root' key={props.data.id} className={props.active ? styles.cardActive : ""}>
      <CardHeader
        title={props.data.googleData.name}
        //avatar={props.data.avatar}
      />
      <CardMedia
          overlay={
                  <CardTitle
                    title={props.data.title}
                    /*subtitle={props.data.date}*/
                    subtitle={<BookmarkBorder 
                                color={white} 
                                hoverColor={greenA200}
                                onClick={this.handleSave.bind(this)}
                              />}
                  />
                }
      >
        
      </CardMedia>
      <CardText>{props.data.contentSnippet} </CardText>
      <Card expanded={this.state.expanded}>
      <CardText expandable={true}>
      <Tabs >
          <Tab label="Workouts">
           <div>
             <h2 className={styles.headline}>Upcoming Workouts</h2>
                <TextField hintText="Workout Title"/> <FitnessCenter />
                    <DatePicker hintText="Select a date" /> 
                    <Toggle
                      name="recur"
                      value="recur"
                      label="Recurring?"
                      toggled={this.state.recur}
                      onToggle={this.handleToggle.bind(this)}
                    />
                  <b>Submit &nbsp;</b><Done hoverColor={blue500} onClick={this.addWorkout.bind(this)} />
                <p>This will render data<FitnessCenter /> </p>
           </div>
          </Tab>
          <Tab label="Comments" >
           <div>
             <h2 style={styles.headline}>Comments/Questions</h2>
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
      {this.state.expanded ? <FlatButton label="Reduce" onTouchTap={this.handleReduce.bind(this)} /> : <FlatButton label="See upcoming workouts" onTouchTap={this.handleExpand.bind(this)} /> } 
      </CardActions>
    </Card>
  }
}



export default MainFeed;
