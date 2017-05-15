import React from 'react'
import PropTypes from 'prop-types'

import GymFeed from './GymFeed'

import './ParkContainer.css'

class ParkContainer extends React.Component {
  perpareParks () {
    const {
      placeById,
      activeIndex,
      onFeedItemClick,
    } = this.props

    return Object.keys(placeById).map((item, index) => (
      <div key={index} className='workout'>
        {
          !item ||
          <GymFeed
              active={activeIndex === index}
              onClick={() => onFeedItemClick(index)}
              data={placeById[item]}
            />
        }
      </div>
    ))
  }

  render () {
    return (
      <div className='__workout__list'>
        {this.perpareParks()}
      </div>
    )
  }
}

ParkContainer.propTypes = {
  placeById: PropTypes.object.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onFeedItemClick: PropTypes.func.isRequired,
}

export default ParkContainer
