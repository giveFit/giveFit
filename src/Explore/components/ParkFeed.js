import React from 'react'
import {findDOMNode} from 'react-dom'
import PropTypes from 'prop-types'

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'

// svg-icons
import BookmarkBorder from 'material-ui/svg-icons/action/bookmark-border'
import { greenA200, white } from 'material-ui/styles/colors'

// Local components
import WorkoutCreatorWithData from './WorkoutCreator/index'

import '../styles.css'

const inlineStyles = {
  subtitleStyle: {
    subtitleColor: 'rgba(211, 211, 211)',
  },
  chip: {
    margin: 4,
  },
  gridList: {
    width: 500,
    height: 250,
    overflowY: 'auto',
  },
  rating: {
    float: 'left',
  },
  save: {
    padding: '10px',
  },
}

class ParkFeed extends React.Component {
  componentWillReceiveProps (newProps) {
    if (newProps.active !== this.props.active && newProps.active === true) {
      const element = findDOMNode(this.root)
       // Scrolls the current element into the visible area of the browser
      element.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
  }

  handleSave () {
    window.alert('hey saving')
    // add a mutation here to save to the user's "saved workouts"
  }
  handleTouchTap () {
    window.alert('You clicked the Chip.')
  }
  // handleOpen of WorkoutCreator
  handleOpen () {
    console.warn('handling open')

    this.setState({open: true})
  };

  render () {
    const {props} = this

    return <div><Card ref={(c) => { this.root = c }} key={props.data.id} className={props.active ? 'cardActive' : ''} onTouchTap={() => this.props.onClick(this.props.parkID)}>
      <CardHeader
        title={props.data.googleData.title}
        subtitle={<a target="_blank" rel='noopener noreferrer' href={'http://maps.google.com/?q=' + props.data.googleData.vicinity}>{props.data.googleData.vicinity}</a>}
        >
      {/* would eventually like to add tags */}
        </CardHeader>
      <CardMedia
        overlay={
          <CardTitle
            style={inlineStyles.rating}
            title={props.data.googleData.rating > 0 ? <div> Rating: {props.data.googleData.rating} </div> : <div></div>}
            subtitle={
              <div className={inlineStyles.save}> Save:
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
        {props.data.googleData.photos ? <img src={props.data.googleData.photos} className='img'/> : <img src="https://placehold.it/400x200/ffffff/000000" />}
      </CardMedia>
      <CardText>

        Click &quot;View Activities&quot; for the calendar of upcoming activities at this location, or &quot;Post an Activity&quot; to create your own.

      </CardText>

      <CardActions>
        <WorkoutCreatorWithData data={this.props.data} />
      </CardActions>
    </Card>
    </div>
  }
}

ParkFeed.propTypes = {
  onClick: PropTypes.func.isRequired,
  parkID: PropTypes.string,
  data: PropTypes.object,
  active: PropTypes.boolean,
}

export default ParkFeed
