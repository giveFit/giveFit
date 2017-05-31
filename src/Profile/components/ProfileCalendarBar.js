import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import FontIcon from 'material-ui/FontIcon'

import './ProfileCalendarBar.css'

export class ProfileCalendarBar extends React.Component {
  prepareWeekDays (todaysDate) {
    const daysOfTheWeek = [
      { name: 'Sun', index: 0 },
      { name: 'Mon', index: 1 },
      { name: 'Tue', index: 2 },
      { name: 'Wed', index: 3 },
      { name: 'Thur', index: 4 },
      { name: 'Fri', index: 5 },
      { name: 'Sat', index: 6 },
    ]

    // this contains the index of the today's weekday
    const todayIndex = todaysDate.day()

    // Because we have the weekday's index, we can sort the array to start it
    // with today's object
    for (let i = 0; i < todayIndex; i++) {
      const dayInTheWeek = daysOfTheWeek.shift()

      // we can use moment's '.day()' method to get the future days of the week,
      // but if the array doesn't start with 'Sun' then we need to continue
      // counting from the highest index
      dayInTheWeek.index = daysOfTheWeek[daysOfTheWeek.length - 1].index + 1

      daysOfTheWeek.push(dayInTheWeek)
    }

    return daysOfTheWeek.map((day, index) => {
      const cloneTodaysDate = todaysDate.clone()
      const dayName = day.name // ex: Wed
      const actualDate = cloneTodaysDate.day(day.index).format('D') // ex: 31

      return (
        <div
          key={`day-of-week-${actualDate}`}
          className={`nested-col ${index === 0 ? 'currentDay' : ''}`}
        >
          <span>{dayName}</span>
          <span>{actualDate}</span>
        </div>
      )
    })
  }

  render () {
    const { todaysDate } = this.props
    const isToday = todaysDate.format('L') === moment().format('L')

    return (
      <div className='profile-calendar-bar'>
        <div className='col'>
          <button
            className={isToday ? 'disabled' : ''}
            onClick={() => this.props.previousWeek()}
          >
            <FontIcon className='material-icons'>chevron_left</FontIcon>
          </button>
        </div>
        <div className='col'>
          {this.prepareWeekDays(todaysDate)}
        </div>
        <div className='col'>
          <button onClick={() => this.props.nextWeek()}>
            <FontIcon className='material-icons'>chevron_right</FontIcon>
          </button>
        </div>
      </div>
    )
  }
}

ProfileCalendarBar.propTypes = {
  todaysDate: PropTypes.object.isRequired,
  previousWeek: PropTypes.func.isRequired,
  nextWeek: PropTypes.func.isRequired,
}

export default ProfileCalendarBar
