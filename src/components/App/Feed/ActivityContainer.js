import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import { CardText, Chip, Avatar, RaisedButton } from 'material-ui'

import Pagination from './subComponents/Pagination'
import WorkoutCreator from './subComponents/WorkoutCreator/index'

import './ActivityContainer.css'

class Activity extends React.Component {
  constructor (props) {
    super(props)

    this.RESULTS_PER_PAGE = 3

    this.state = {
      currentPage: 0,
      resultsPerPage: this.RESULTS_PER_PAGE
    }
  }

  // @todo: Make titles, date, time, description required
  // Date and times should be stored as a unix timestamp
  WorkoutList () {
    const { currentPage, resultsPerPage } = this.state
    const startIndex = currentPage ? currentPage * 5 : 0
    const endIndex = startIndex + resultsPerPage

    return this.props.workouts
      .slice(startIndex, endIndex)
      // @todo: sort this by date
      .map((workout, index) => {
        workout = workout.node

        return (
          <CardText key={`workout-${index}`}>
            <div className='workout-header'>
              <Chip
                onTouchTap={() => this.context.router.push('/profile')}
                className='chip'
              >
                <Avatar
                  src={workout.Workout.picture}
                  onClick={() => this.context.router.push('/profile')}
                />
                <span>{workout.Workout.nickname}</span>
              </Chip>
              <div className='workout-title'>
                {workout.title || 'N/A'}
                <i className='fa fa-pencil edit-icon' />
              </div>
            </div>
            <div className='workout-date'>
              {workout.date ? moment(workout.date).format('ddd MMM Do YYYY') : 'N/A'} {workout.time ? moment(workout.time).format('LT') : 'N/A'}
            </div>
            <div className='workout-description'>
              {workout.description}
            </div>
            <div className='button-container'>
              <RaisedButton
                backgroundColor={'#1F01B9'}
                labelColor={'white'}
                label='RSVP'
                className='rsvp-button'
                onTouchTap={() => console.log('RSVP\'ing to this Place')}
              />
              <div
                className='share-button'
                onClick={() => console.log('Sharing to this Place')}
              >
                <span>Share</span>
                <i className='fa fa-share share-icon' />
              </div>
            </div>
          </CardText>
        )
      })
  }

  setPage (page) {
    this.setState({ currentPage: page })
  }

  nextPage () {
    this.setState({ currentPage: this.state.currentPage + 1 })
  }

  previousPage () {
    const { currentPage } = this.state

    this.setState({ currentPage: (currentPage - 1 < 0) ? 0 : currentPage - 1 })
  }

  render () {
    // Round Result up because maxPage is number of pages to display all the
    // results
    const maxPage = Math.ceil(this.props.workouts.length / this.RESULTS_PER_PAGE)

    return (
      <div className='container'>
        <div className='header'>
          <i
            className='fa fa-times'
            style={{ color: 'white', cursor: 'pointer' }}
            onClick={() => this.props.closeActivity()}
          />
          <span style={{ color: '#000032' }}>{this.props.parkTitle}</span>
          <WorkoutCreator
            indexedPlaces={this.props.indexedPlaces}
          />
        </div>
        <div className='body'>
          <Pagination
            maxPage={maxPage}
            currentPage={this.state.currentPage}
            setPage={(page) => this.setPage(page)}
            next={() => this.nextPage()}
            previous={() => this.previousPage()}
          />
          {this.WorkoutList()}
        </div>
      </div>
    )
  }
}

Activity.propTypes = {
  openedActivity: PropTypes.string.isRequired,
  parkTitle: PropTypes.string.isRequired,
  workouts: PropTypes.array.isRequired,
  closeActivity: PropTypes.func.isRequired
}

export default Activity
