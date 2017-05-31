import React from 'react'
import PropTypes from 'prop-types'

import './ProfileCalendarRow.css'

export class ProfileCalendarRow extends React.Component {
  prepareWorkouts () {
    return [1, 2, 3, 4, 5, 6, 7].map((workout) => {
      return (
        <div
          key={`workout-${workout}`}
          className='grey-square'
        >
          <span></span>
        </div>
      )
    })
  }

  render () {
    const { parkId } = this.props

    return (
      <div className='profile-calendar'>
        <div className='col'>
          <div className='outline-square'>
            <span>{parkId}</span>
          </div>
        </div>
        <div className='col'>
          {this.prepareWorkouts()}
        </div>
        <div className='col'>
        </div>
      </div>
    )
  }
}

ProfileCalendarRow.propTypes = {
  parkId: PropTypes.string.isRequired,
  workouts: PropTypes.array.isRequired,
}

export default ProfileCalendarRow
