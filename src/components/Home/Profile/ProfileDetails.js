import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import './styles.css'

export class ProfileDetails extends React.Component {
  render () {
    const { profile } = this.props
    const { address } = profile.user_metadata || {}

    return (
      <div className='root'>
        <Avatar src={profile.picture_large} size={120} />
        <h3><strong>{profile.name}</strong></h3>
        <p><strong>Created At: </strong> {profile.created_at}</p>
        <p><strong>Updated At: </strong> {profile.updated_at}</p>
      </div>
    )
  }
}

ProfileDetails.propTypes = {
  profile: PropTypes.object,
}
export default ProfileDetails
