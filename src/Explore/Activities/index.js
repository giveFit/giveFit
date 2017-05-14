import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import { CardText, Chip, Avatar } from 'material-ui'

import './styles.css'

class Activities extends React.Component {
  WorkoutList () {
    return this.props.workouts
      // @todo: sort this by date
      .map((workout, index) => {
        workout = workout.node

        return (
          <CardText key={`workout-${index}`}>
            <div className='__workout__header'>
              <Chip
                onTouchTap={() => this.context.router.push('/profile')}
                className='__chip'
              >
                <Avatar
                  src={workout.Workout.picture}
                  onClick={() => this.context.router.push('/profile')}
                />
                <span>{workout.Workout.nickname}</span>
              </Chip>
              <div className='__workout__title'>
                <span><b>Exercise Title:</b> {workout.title}</span>
                <span><b>Exercise Type:</b> {workout.type}</span>
              </div>
            </div>
            <div className='__workout__image__container'>
              <img
                width='100%'
                height='300'
                src={workout.pictureURL}
              />
              <div className='__workout__information'>
                <div>{moment(workout.startDateTime).format('ddd MMM Do, YYYY h:mm a')} - {moment(workout.endDateTime).format('LT')}</div>
                <div><i className='fa fa-bookmark-o __share__icon' /></div>
                <div><i className='fa fa-share __share__icon' /></div>
              </div>
            </div>
            {workout.description && <div className='__description_container'>
              <div><b>Description</b></div>
              <div>{workout.description}</div>
            </div>}
          </CardText>
        )
      })
  }

  render () {
    return (
      <div className='__activities'>
        {this.WorkoutList()}
      </div>
    )
  }
}

Activities.propTypes = {
  workouts: PropTypes.array.isRequired,
}

export default Activities
