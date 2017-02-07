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
	constructor(props){
		console.log('WorkoutPost props', props)
		super(props)
	}
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
		        {

		        	<Avatar />
		          
		        }
		          
		        </Chip> 
		        {this.props.data[0].node.title}
	      </CardText>
		)
	}
}

export default WorkoutPost;