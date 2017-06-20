import React from 'react'
import PropTypes from 'prop-types'

import Avatar from 'material-ui/Avatar'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import UploadPicture from 'components/UploadPicture'

import './ProfileDetails.css'

class ProfileDetails extends React.Component {
  prepareChangeProfilePhotoButton () {
    return (
      <div className='edit-profile-photo-container'>
        <UploadPicture
          icon='camera_alt'
          iconColor='white'
          onChange={(url) => this.props.onProfilePhotoChange(url)}
        />
        <br />
        <span>Change your profile photo</span>
      </div>
    )
  }

  prepareUserInfo () {
    const { nickname, picture, editMode, onUserNicknameChange } = this.props

    return (
      <div className='profile-user-info'>
        <div className='profile-user-photo'>
          <Avatar src={picture} size={100} />
          {editMode && this.prepareChangeProfilePhotoButton()}
        </div>
        <TextField
          id='user-nickname'
          className='nickname'
          value={nickname}
          disabled={!editMode}
          onChange={(e) => onUserNicknameChange(e.target.value)}
          underlineShow={editMode}
          fullWidth
          multiLine

        />
      </div>
    )
  }

  prepareButton () {
    if (!this.props.editMode) {
      return (
        <div>
          <RaisedButton
            className='edit-profile-button'
            label='Edit Profile'
            onTouchTap={() => this.props.onEnableEdit(true)}
          />
        </div>
      )
    }

    return (
      <div>
        <RaisedButton
          className='cancel-profile-button'
          label='Cancel'
          onTouchTap={() => this.props.onEnableEdit(false)}
        />
        <RaisedButton
          className='save-profile-button'
          label='Save Changes'
          onTouchTap={() => this.props.onSaveProfileChanges()}
        />
      </div>
    )
  }

  render () {
    const { description, editMode, onUserDescriptionChange } = this.props

    return (
      <div className='profile-details'>
        {this.prepareUserInfo()}
        <div>
          <TextField
            id='user-description'
            className='description'
            value={description || 'No Description available'}
            disabled={!editMode}
            onChange={(e) => onUserDescriptionChange(e.target.value)}
            underlineShow={editMode}
            fullWidth
            multiLine
          />
        </div>
        {this.prepareButton()}
      </div>
    )
  }
}

ProfileDetails.propTypes = {
  description: PropTypes.string,
  nickname: PropTypes.string,
  picture: PropTypes.string,
  onEnableEdit: PropTypes.func.isRequired,
  onSaveProfileChanges: PropTypes.func.isRequired,
  onProfilePhotoChange: PropTypes.func.isRequired,
  onUserNicknameChange: PropTypes.func.isRequired,
  onUserDescriptionChange: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  // auth: PropTypes.object.isRequired,
}

export default ProfileDetails
