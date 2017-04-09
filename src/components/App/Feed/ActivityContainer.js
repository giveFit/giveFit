import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import { CardText, Chip, Avatar, RaisedButton } from 'material-ui'

import Pagination from './subComponents/Pagination'
import WorkoutCreator from './subComponents/WorkoutCreator'

const styles = {
  container: {
    position: 'absolute',
    border: '3px solid #efefef',
    margin: '0.2em',
    background: 'white',
    height: '80%',
    overflow: 'scroll',
    top: 0,
    right: 0,
    minWidth: '50%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#D7546A',
    border: '2px solid black',
    padding: '0.2em 0.5em'
  },
  workoutHeader: {
    display: 'flex'
  },
  workoutTitle: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    paddingLeft: '1em',
    justifyContent: 'space-between'
  },
  workoutDate: {
    color: 'grey',
    padding: '1em 1em 1em 0'
  },
  workoutDescription: {
    borderBottom: '2px solid #efefef'
  },
  buttonContainer: {
    borderBottom: '2px solid #efefef',
    display: 'flex',
    justifyContent: 'space-between'
  },
  rsvpButton: {
    margin: '0.5em 0',
    boxShadow: '3px 3px 8px black',
    cursor: 'pointer'
  },
  shareButton: {
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer'
  },
  shareIcon: {
    fontSize: '2em',
    paddingLeft: '0.5em'
  },
  editIcon: {
    color: 'grey',
    paddingLeft: '0.4em',
    fontSize: '1.2em',
    cursor: 'pointer'
  },
  chip: {
    margin: 4
  }
}

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
            <div className='workout-header' style={styles.workoutHeader}>
              <Chip
                onTouchTap={() => this.context.router.push('/profile')}
                style={styles.chip}
              >
                <Avatar
                  src={workout.Workout.picture}
                  onClick={() => this.context.router.push('/profile')}
                />
                <span>{workout.Workout.nickname}</span>
              </Chip>
              <div className='workout-title' style={styles.workoutTitle}>
                {workout.title || 'N/A'}
                <i className='fa fa-pencil' style={styles.editIcon} />
              </div>
            </div>
            <div className='workout-date' style={styles.workoutDate}>
              {workout.date ? moment(workout.date).format('ddd MMM Do YYYY') : 'N/A'} {workout.time ? moment(workout.time).format('LT') : 'N/A'}
            </div>
            <div className='workout-description' style={styles.workoutDescription}>
              {workout.description}
            </div>
            <div className='button-container' style={styles.buttonContainer}>
              <RaisedButton
                backgroundColor={'#1F01B9'}
                labelColor={'white'}
                label='RSVP'
                style={styles.rsvpButton}
                onTouchTap={() => console.log('RSVP\'ing to this Place')}
              />
              <div
                className='share-button'
                style={styles.shareButton}
                onClick={() => console.log('Sharing to this Place')}
              >
                <span>Share</span>
                <i className='fa fa-share' style={styles.shareIcon} />
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
      <div style={styles.container}>
        <div className='header' style={styles.header}>
          <i
            className='fa fa-times'
            style={{ color: 'white', cursor: 'pointer' }}
            onClick={() => this.props.closeActivity()}
          />
          <span style={{ color: '#000032' }}>{this.props.parkTitle}</span>
          <WorkoutCreator />
        </div>
        <div className='body' style={styles.body}>
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
