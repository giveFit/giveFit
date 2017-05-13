import React from 'react'
import PropTypes from 'prop-types'

import { Card, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import FindWorkouts from './FindWorkouts'

import './styles.css'

class HomeLoggedIn extends React.Component {
  quickEnter () {
    // I want users to be able to press the button without entering anything,
    // but still have the value declaration below for when i do a location query
    // const {value} = this.refs.textbox.input;
    this.context.router.push('/app')
  }

  handleSubmit () {
    // I want users to be able to press the button without entering anything,
    // but still have the value declaration below for when i do a location query
    // const {value} = this.refs.textbox.input;
    const fWPosString = window.localStorage.getItem('__find_workouts_pos')
    const fWAddress = window.localStorage.getItem('__find_workouts_address')

    if (fWPosString) {
      const {lat, lng} = JSON.parse(fWPosString)

      return this.context.router.push(`/app?lat=${lat}&lng=${lng}`)
    }

    if (fWAddress) {
      return this.findWorkoutsComponent.getLatLng(fWAddress).then(results => {
        const {geometry: {location}} = results[0]
        const lat = location.lat()
        const lng = location.lng()

        this.context.router.push(`/app?lat=${lat}&lng=${lng}`)
      })
    }

    this.context.router.push(`/app`)
  }

  // Need Google maps API here
  handleAutoComplete () {
    new window.google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')), {
        types: ['geocode'],
      }
    )
  }

  render () {
    return (
      <div className='banner'>
        <div className='bannerInner'>
          <h1 className='heading'>Find Your Fitness Tribe</h1>
          <h3 className='subHeading'>Connect with free fitness groups right in your community</h3>
          <Card className='bannerCard'>
            <CardText>
              <FindWorkouts
                ref={(node) => {
                  this.findWorkoutsComponent = node
                }}
              />
              <RaisedButton
                label="Find My Tribe"
                secondary={true}
                className='submitButton'
                onTouchTap={() => this.handleSubmit()}
              />
            </CardText>
          </Card>
        </div>
      </div>
    )
  }
}

HomeLoggedIn.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default HomeLoggedIn

// import Paper from 'material-ui/Paper'
// Using most simple landing page until adding more design
// <h2 className='featuredWorkouts'>
//   <CardText>Our community partners</CardText>
//   <Paper style={inlineStyles.paper} zDepth={1} />
//   <Paper style={inlineStyles.paper} zDepth={2} />
//   <Paper style={inlineStyles.paper} zDepth={1} />
//   <Paper style={inlineStyles.paper} zDepth={2} />
//   <Paper style={inlineStyles.paper} zDepth={1} />
//   <Paper style={inlineStyles.paper} zDepth={2} />
//   <Paper style={inlineStyles.paper} zDepth={1} />
//   <CardText>
//     GiveFit takes the pressure out of working out. We help you find likeminded "tribes"
//     who happen to live nearby.
//   </CardText>
//   <CardText>
//     GiveFit takes the pressure out of working out. We help you find likeminded "tribes"
//     who happen to live nearby.
//   </CardText>
//   <Paper style={inlineStyles.paper} zDepth={1} />
//     <Paper style={inlineStyles.paper} zDepth={2} />
//     <Paper style={inlineStyles.paper} zDepth={1} />
//     <Paper style={inlineStyles.paper} zDepth={2} />
//     <Paper style={inlineStyles.paper} zDepth={1} />
//     <Paper style={inlineStyles.paper} zDepth={2} />
//     <Paper style={inlineStyles.paper} zDepth={1} />
//   <div className='searchAgain'>
//     <div className='bannerInner'>
//       <h1 className='heading'>Find Your Fitness Tribe</h1>
//       <h3 className='subHeading'>Connect with fitness groups right in your community</h3>
//       <Card className='bannerCard'>
//         <CardText>
//           <FindWorkouts ref={node=>this.findWorkoutsComponent = node}/>
//           <RaisedButton label="Find My Tribe" secondary={true} className='submitButton' onTouchTap={()=>this.handleSubmit()} />
//         </CardText>
//       </Card>
//     </div>
//   </div>
// </h2>
