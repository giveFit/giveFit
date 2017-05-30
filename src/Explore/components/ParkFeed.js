import React from 'react'
import {findDOMNode} from 'react-dom'
import PropTypes from 'prop-types'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Tabs, Tab} from 'material-ui/Tabs'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import { Avatar, Chip } from 'material-ui'
import {GridList, GridTile} from 'material-ui/GridList'

// svg-icons
import BookmarkBorder from 'material-ui/svg-icons/action/bookmark-border'
import Done from 'material-ui/svg-icons/action/done'
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center'
import DatePicker from 'material-ui/DatePicker'
import Comment from 'material-ui/svg-icons/communication/comment'
import {blue500, red500, greenA200, white} from 'material-ui/styles/colors'

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
      const element = findDOMNode(this.refs.root)
       // Scrolls the current element into the visible area of the browser
      element.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
  }

  handleSave () {
    alert('hey saving')
    // add a mutation here to save to the user's "saved workouts"
  }
  handleTouchTap () {
    alert('You clicked the Chip.')
  }
  // handleOpen of WorkoutCreator
  handleOpen () {
    console.log('handling open')
    this.setState({open: true})
  };

  render () {
    const {props} = this

    return <div><Card ref='root' key={props.data.id} className={props.active ? 'cardActive' : ''} onTouchTap={() => this.props.onClick(this.props.parkID)}>
      <CardHeader
        title={props.data.googleData.title}
        subtitle={<a href={'http://maps.google.com/?q=' + props.data.googleData.vicinity} target="_blank">{props.data.googleData.vicinity}</a>}
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

        Click "View Activities" for the calendar of upcoming activities at this location, or "Post an Activity" to create your own.

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
}

export default ParkFeed
