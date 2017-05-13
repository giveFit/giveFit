import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'

import './Details.css'

export class ProfileDetails extends React.Component {
  render () {
    const { profile } = this.props

    return (
      <div className='profile-details'>
        <Avatar src={profile.picture} size={120} />
        <h3><strong>{profile.name}</strong></h3>
      </div>
    )
  }
}

ProfileDetails.propTypes = {
  profile: PropTypes.object.isRequired,
}

export default ProfileDetails
