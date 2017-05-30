import React from 'react'
import PropTypes from 'prop-types'

import UploadPicture from 'components/UploadPicture'
import './ProfileHeader.css'

export class ProfileHeader extends React.Component {
  prepareChangeHeaderPhotoButton () {
    return (
      <div className='edit-header-photo-container'>
        <UploadPicture
          icon='camera_alt'
          iconColor='white'
          onChange={(url) => this.props.onProfileHeaderChange(url)}
        />
        <br />
        <span>Change your header photo</span>
      </div>
    )
  }

  render () {
    const { headerPhotoURL, editMode } = this.props

    return (
      <div className='profile-header'>
        <div>
          <img src={headerPhotoURL} />
        </div>
        {editMode && this.prepareChangeHeaderPhotoButton()}
      </div>
    )
  }
}

ProfileHeader.propTypes = {
  editMode: PropTypes.bool.isRequired,
  headerPhotoURL: PropTypes.string.isRequired,
  onProfileHeaderChange: PropTypes.func.isRequired,
}

export default ProfileHeader
