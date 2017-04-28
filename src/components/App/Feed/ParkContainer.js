import React from 'react'
import PropTypes from 'prop-types'

import { Card } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'

import ParkFeed from './subComponents/ParkFeed'
import GymFeed from './subComponents/GymFeed'
import DayPicker from './subComponents/DayPicker'

import './styles.css'

class ParkContainer extends React.Component {
  perpareParks () {
    const {
      placeById,
      activeIndex,
      toggleActivity,
      onFeedItemClick
    } = this.props

    return Object.keys(placeById).map((item, index) => (
      <div key={index} className='workout'>
        {!item ||
          (placeById[item].googleData.types.indexOf('Park') !== -1
            ? <ParkFeed
              active={activeIndex === index}
              onClick={(parkID) => onFeedItemClick(index, parkID)}
              data={placeById[item]}
              toggleActivity={toggleActivity}
              parkID={item}
            />
            : <GymFeed
              active={activeIndex === index}
              onClick={() => onFeedItemClick(index)}
              data={placeById[item]}
            />
          )}
      </div>
    ))
  }

  render () {
    const { parks, profile } = this.props

    if (!parks.length) {
      return (
        <Card>
          <CircularProgress size={80} />
        </Card>
      )
    }

    return (
      // list with google data
      <div className='gridList' >
        <DayPicker className='stackedTop' profile={profile} geocoder={this.geocoder} />
        <div className='workoutList'>
          {this.perpareParks(parks)}
        </div>
      </div>
    )
  }
}

ParkContainer.propTypes = {
  placeById: PropTypes.object.isRequired,
  activeIndex: PropTypes.number.isRequired,
  toggleActivity: PropTypes.func.isRequired,
  onFeedItemClick: PropTypes.func.isRequired
}

export default ParkContainer
