import React from 'react'
import PropTypes from 'prop-types'

import {CardText, Chip, Avatar} from 'material-ui'
import Checkbox from 'material-ui/Checkbox'
import Snackbar from 'material-ui/Snackbar'

const inlineStyles = {
  subtitleStyle: {
    subtitleColor: 'rgba(211, 211, 211)'
  },
  chip: {
    margin: 4
  },
  checkbox: {
    marginBottom: 16
  }
}

class WorkoutPost extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      snack: false,
      autoHideDuration: 2000,
      messageTrue: 'Event added to your calendar',
      messageFalse: 'Event removed from your calendar'
    }
  }

  handleRequestClose () {
	    this.setState({snack: false})
  };
  handleSnack () {
    this.setState({snack: !this.state.snack})
  }
  handleTouchTap () {
    alert('You clicked the Chip.')
  }
  handleActionTouchTap () {
	    this.setState({
	      snack: false
	    })
    alert('Event removed from your calendar.')
  };

  render () {
    return (
			<div>
				{(this.props.data.node.Workout && this.props.data.node.title)
					? <CardText>
				        <Chip
				          onTouchTap={() => this.context.router.push('/profile')}
				          style={inlineStyles.chip}
				        >
		        		<Avatar
			                src={this.props.data.node.Workout.picture}
			                onClick={() => this.context.router.push('/profile')}
				        />
				        {this.props.data.node.Workout.nickname}
				        </Chip>
				        {
				        	<div>
					        	<p>Title: {this.props.data.node.title}</p>
						        <p>Date: {this.props.data.node.startDateTime.substr(0, 10)}</p>
						        <p>Time: {this.props.data.node.startDateTime.substr(11, 5)}</p>
						        <p>Description: {this.props.data.node.description}</p>
						        	<Checkbox
									   label="RSVP"
									   style={inlineStyles.checkbox}
									   onCheck={this.handleSnack.bind(this)}
									/>
						    </div>
					    }
			      </CardText>
					: null
				}
			<Snackbar
		      open={this.state.snack}
		      message={this.state.messageTrue}
		      action="undo"
		      autoHideDuration={this.state.autoHideDuration}
		      onActionTouchTap={this.handleActionTouchTap.bind(this)}
		      onRequestClose={this.handleRequestClose.bind(this)}
		    />
			</div>
    )
  }
}

WorkoutPost.contextTypes = {
  router: PropTypes.object.isRequired
}

export default WorkoutPost
