import React, { PropTypes as T } from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AuthService from 'utils/AuthService';
import TextField from 'material-ui/TextField';
import styles from './styles.module.css';
import RaisedButton from 'material-ui/RaisedButton';

export class LandingPage extends React.Component {
  handleSubmit(){
    const {value} = this.refs.textbox.input;
    if(value.length > 0){
      this.context.router.push('/app');
    }
  }
  render(){
    const workouts=(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : [];
    console.log(workouts);
    return<div>
    <div className={styles.banner}>
    <div className={styles.bannerInner}>
      <h1 className={styles.heading}>Givefit</h1>
      <h3 className={styles.subHeading}>Find your free fitness community</h3>
      <Card className={styles.bannerCard}>
        <CardText>
          <TextField
           hintText="Start typing here.."
           floatingLabelText="Search for Workouts"
           ref="textbox"
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
    <Card>

         <CardText>
         Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
         Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
         Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
       </CardText>

  <CardText className={styles.workouts}>
    {workouts.map(workout=>workout.node).map((workout,index)=><Card className={styles.workout} key={index}>  <CardMedia>
       <img src={workout.avatar} />
     </CardMedia><CardText>{workout.title}</CardText></Card>)}
</CardText>
  </Card>

  </div>
  }
}

LandingPage.contextTypes = {
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

const LandingPageContainerWithData = graphql(GET_THROUGH_VIEWER, {
	options(props) {
		return {
		variables: {
			first : FIRST
		}
	};
}})(LandingPage);

export default LandingPageContainerWithData;
