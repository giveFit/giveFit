import React, { PropTypes as T } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, GridList} from 'material-ui/Card';
import MainFeed from '../Feed/subComponents/MainFeed';
import MainToolbar from '../Header/MainToolbar'

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AuthService from 'utils/AuthService';
import TextField from 'material-ui/TextField';
import styles from './styles.module.css';
import RaisedButton from 'material-ui/RaisedButton';
import {orange500, blue500} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

const inlineStyles = {
  textFieldStyle: {
    color: orange500,
  }
}

export class HomeLoggedIn extends React.Component {
  constructor(props, context) {
    console.log('GridContainer constructor', props)
      super(props, context)
      this.state = {
        profile: props.route.auth.getProfile(),
        token: props.route.auth.getToken()
      };

    props.route.auth.on('profile_updated', (newProfile) => {
      console.log('newProfile', newProfile)
      var access_token = this.state.token;
      var identity = newProfile.identities[0];
      console.log("token", access_token)
      console.log("identity", identity)
      this.props.register({
        identity, access_token
      }).then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
      console.log('what do we have', newProfile)
      this.setState({
        profile: newProfile,
      })
    })
  }

  handleSubmit(){
    /*I want users to be able to press the button without
    entering anything, but still have the value declaration
    below for when i do a location query*/
    /*const {value} = this.refs.textbox.input;*/
    this.context.router.push('/app');
  }
  render(){
    const workouts=(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : [];
    console.log('workouts', workouts);
    const listView = workouts.length ? <div className={styles.workouts}>
    {workouts.map((item, index) => (
         <div key={index} className={styles.workout}> {!item ||
          (<MainFeed
            data={item.node}
         />)} </div>
    ))}
    </div>: <CircularProgress size={80} />
    return (
      <div className={styles.root}>
      <MainToolbar 
        auth={this.props}
        profile={this.state.profile}
      />
      <div className={styles.banner}>
      <div className={styles.bannerInner}>
        <h1 className={styles.heading}>Find Your Fitness Tribe</h1>
        <h3 className={styles.subHeading}>Starting in Baltimore</h3>
        <Card className={styles.bannerCard}>
          <CardText>
            <TextField
             hintText="Start typing here.."
             floatingLabelText="Search by location or type of workout"
             ref="textbox"
             textareaStyle={inlineStyles.textFieldStyle}
             onKeyDown={(e)=>{
               if(e.which===13){
                 this.handleSubmit();
               }
             }}
           />
           <RaisedButton label="Search for Workouts" secondary={true} className={styles.submitButton} onTouchTap={()=>this.handleSubmit()} />
           <br />
        </CardText>
        </Card>
        </div>
      </div>
      <h3 className={styles.featuredWorkouts}>
           Check out this week's highlighted workout groups. 
           Search above for more awesome group workouts in your area.
      </h3>
       {listView}
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
const FIRST = 4;

const HomeLoggedInWithData = graphql(GET_THROUGH_VIEWER, {
	options(props) {
		return {
		variables: {
			first : FIRST
		}
	};
}})(HomeLoggedIn);

export default HomeLoggedInWithData;
