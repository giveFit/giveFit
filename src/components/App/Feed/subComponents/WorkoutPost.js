import React, {Component, PropTypes as T} from 'react'
import {CardText, Chip, Avatar} from 'material-ui'
import { Route, Router, Link, pathname, hashHistory } from 'react-router'

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
			<div>
				{(this.props.data.node.Workout && this.props.data.node.title) ? 
					<CardText>
				        <Chip
				          onTouchTap={()=>this.context.router.push('/profile')}
				          style={inlineStyles.chip}
				        >
				        	
		        		<Avatar 
			                src={this.props.data.node.Workout.picture}
			                onClick={()=>this.context.router.push('/profile')} 
				        />
				        
				        {this.props.data.node.Workout.nickname}  
				        </Chip> 
				        {
				        	<div>
					        	<p>Title: {this.props.data.node.title}</p>
						        <p>Date: {this.props.data.node.date}</p>
						        <p>Time: {this.props.data.node.date}</p>
						        <p>Description: {this.props.data.node.description}</p>
						    </div>
					    }
			      </CardText>
					: null
				}
			</div>
		)
	}
}

WorkoutPost.contextTypes = {
      router : T.object.isRequired
    }

export default WorkoutPost;