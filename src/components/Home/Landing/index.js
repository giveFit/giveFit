import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, GridList} from 'material-ui/Card'
import MainFeed from '../Feed/subComponents/MainFeed'
import MainToolbar from '../Header/MainToolbar'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import AuthService from 'utils/AuthService'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {orange500, blue500} from 'material-ui/styles/colors'

import './styles.css'

const inlineStyles = {
  textFieldStyle: {
    color: orange500,
  },
}

export class LandingPage extends React.Component {
  handleSubmit () {
    /* I want users to be able to press the button without
    entering anything, but still have the value declaration
    below for when i do a location query */
    /* const {value} = this.refs.textbox.input; */
    this.context.router.push('/explore')
  }
  render () {
    const workouts = (!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []
    console.log('workouts', workouts)
    const listView = workouts.length ? <div className='workouts'>
    {workouts.map((item, index) => (
         <div key={index} className='workout'> {!item ||
          (<MainFeed
            data={item.node}
         />)} </div>
    ))}
    </div> : <h4> Loading... </h4>
    return (
      <div className='root'>
      <MainToolbar auth={this.props}/>
      <div className='banner'>
      <div className='bannerInner'>
        <h1 className='heading'>Find Your Fitness Tribe</h1>
        <h3 className='subHeading'>Starting in Baltimore</h3>
        <Card className='bannerCard'>
          <CardText>
            <TextField
             hintText="Start typing here.."
             floatingLabelText="Search by location or type of workout"
             ref="textbox"
             textareaStyle={inlineStyles.textFieldStyle}
             onKeyDown={(e) => {
               if (e.which === 13) {
                 this.handleSubmit()
               }
             }}
           />
           <RaisedButton label="Search for Workouts" secondary={true} className='submitButton' onTouchTap={() => this.handleSubmit()} />
           <br />
        </CardText>
        </Card>
        </div>
      </div>
      <h2>
           Check out this week&quos;s highlighted workout groups.
           Search above for more awesome group workouts in your area.
      </h2>
       {listView}
    </div>
    )
  }
}

LandingPage.contextTypes = {
  router: PropTypes.object,
}

// Get some WorkoutGroups
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
`

// How many WorkoutGroups to return
const FIRST = 4

const LandingPageContainerWithData = graphql(GET_THROUGH_VIEWER, {
  options (props) {
    return {
      variables: {
        first: FIRST,
      },
    }
  },
})(LandingPage)

export default LandingPageContainerWithData
