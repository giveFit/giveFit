import React, { PropTypes as T } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, GridList} from 'material-ui/Card';
import HomeFeed from './SubComponents/HomeFeed';
import LoggedInToolbar from '../Header/LoggedInToolbar'
import MainToolbar from '../../Home/Header/MainToolbar'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AuthService from 'utils/AuthService';
import TextField from 'material-ui/TextField';
import styles from './styles.module.css';
import RaisedButton from 'material-ui/RaisedButton';
import {orange500, blue500, indigo500} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import apolloConfig from '../../../../apolloConfig';
import AppLoggedInWithData from '../Feed/AppLoggedIn';
import BottomNav from './SubComponents/BottomNavigation';

const inlineStyles = {
  textFieldStyle: {
    color: indigo500,
  }
}

export class HomeLoggedIn extends React.Component {
  constructor(props, context) {
    console.log('HomeLoggedIn props', props)
    super(props, context)
    this.state = {
      profile: null,
      token: null,
      userId: null,
      //hintText: "Enter a location"
    };    
  }
  /*componentDidMount(){
    console.log('componentDidMount');
    localStorage.setItem('userId', JSON.stringify(this.state.userId))
  }*/
  handleSubmit(){
    /*I want users to be able to press the button without
    entering anything, but still have the value declaration
    below for when i do a location query*/
    /*const {value} = this.refs.textbox.input;*/
    this.context.router.push('/app');
  }
  //Need Google maps API here
  handleAutoComplete(){
    /*this.setState({
      hintText = null;
    })*/
    new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')), {
        types: ['geocode']
    });
  }
  render(){
    console.log('HomeLoggedIn this', this)
    const workouts=(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : [];
    const listView = workouts.length ? <div className={styles.workouts}>
    {workouts.map((item, index) => (
         <div key={index} className={styles.workout}> {!item ||
          (<HomeFeed
            data={item.node}
         />)} </div>
    ))}
    </div> : <CircularProgress size={80} />
    return (
      <div className={styles.root}>
        <div className={styles.banner}>
        <div className={styles.bannerInner}>
          <h1 className={styles.heading}>Find Your Fitness Group</h1>
          <h3 className={styles.subHeading}>Starting in Baltimore</h3>
          <Card className={styles.bannerCard}>
            <CardText>
              <TextField
               ref="textbox"
               id="autocomplete"
               hintText="Enter a location"
               multiLine={true}
               onTouchTap={this.handleAutoComplete.bind(this)}
               textareaStyle={inlineStyles.textFieldStyle}
               onKeyDown={(e)=>{
                 if(e.which===13){
                   this.handleSubmit();
                 }
               }}
             />
             <RaisedButton label="Find Groups" secondary={true} className={styles.submitButton} onTouchTap={()=>this.handleSubmit()} />
             <br />
          </CardText>
            <h2 className={styles.description}>Connect with fitness groups right in your community.</h2>
          </Card>
          </div>
        </div>
        <BottomNav />
        
      </div>
    )
  }
}

HomeLoggedIn.contextTypes = {
  router: T.object
};


//Get some WorkoutGroups
const GET_THROUGH_VIEWER = gql`
	query GetThroughViewer($first: Int) {
  	viewer {
	  	allWorkoutGroups(first: $first) {
	  		edges {
	  			node {
				  id
				  image
				  title
				  lat
				  lng
				  avatar
				  contentSnippet
	  			}
	  		}
	  	}
	}
}
`;

//How many WorkoutGroups to return
const FIRST = 8;


const HomeLoggedInWithData =  compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({  
      variables: { first : FIRST } 
    }),
  })
)(HomeLoggedIn);

export default HomeLoggedInWithData;
