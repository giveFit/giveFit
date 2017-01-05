import React, {Component} from 'react'
import {CardText, Chip, Avatar} from 'material-ui'

const inlineStyles = {
  subtitleStyle: {
    subtitleColor: 'rgba(211, 211, 211)'
  },
  chip: {
    margin: 4,
  }
};

class WorkoutPost extends Component{
	 handleTouchTap(){
		alert('You clicked the Chip.');
	}
	render(){
		return(
			<CardText>
		        <Chip
		          onTouchTap={this.handleTouchTap}
		          style={inlineStyles.chip}
		        >
		          <Avatar />
		          Image Avatar Chip
		        </Chip> 
		        1/17/2017, yoga on the hill, bring your mat, I'll be instructing an intermediate class
	      </CardText>
		)
	}
}

export default WorkoutPost;