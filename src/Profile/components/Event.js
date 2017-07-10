import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import {CardText, Chip, Avatar, Card} from 'material-ui'
import Checkbox from 'material-ui/Checkbox'

const inlineStyles = {
  subtitleStyle: {
    subtitleColor: 'rgba(211, 211, 211)',
  },
  chip: {
    margin: 4,
  },
  checkbox: {
    marginBottom: 16,
  },
}

class Event extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      snack: false,
      autoHideDuration: 2000,
      messageTrue: 'Event added to your calendar',
      messageFalse: 'Event removed from your calendar',
    }
  }

  handleRequestClose () {
    this.setState({snack: false})
  }

  handleSnack () {
    this.setState({snack: !this.state.snack})
  }

  handleTouchTap () {
    window.alert('You clicked the Chip.')
  }

  handleActionTouchTap () {
    this.setState({snack: false})
    window.alert('Event removed from your calendar.')
  }

  render () {
    const { event } = this.props

    return (
      <div>
        <Card>
          <CardText>
            <Chip
              onTouchTap={() => this.context.router.push('/profile')}
              style={inlineStyles.chip}
            >
              <Avatar
                src={event.user.picture}
                onClick={() => this.context.router.push('/profile')}
              />
              {event.user.nickname}
            </Chip>
            {
              <div>
                <p>Title: {event.title}</p>
                <p>Date: {moment(event.start).format('dddd, MMMM Do YYYY')}</p>
                <p>Time: {moment(event.start).format('h:mm a')}</p>
                <p>Description: {event.description}</p>
                {event.rsvp &&
                  <Checkbox
                    label="RSVP"
                    style={inlineStyles.checkbox}
                    checked={true}
                    disabled={true}
                  />
                }
              </div>
            }
          </CardText>
        </Card>
      </div>
    )
  }
}

Event.propTypes = {
  event: PropTypes.object,
}

export default Event
