import React, { PropTypes as T } from 'react'
import Avatar from 'material-ui/Avatar';
import s from './styles.module.css'

export class ProfileDetails extends React.Component {
  render(){
    const { profile } = this.props
    console.log(profile);
    const { address } = profile.user_metadata || {}
    return (
      <div className={s.root}>
          <Avatar src={profile.picture_large} size={300} />        
          <h3><strong>{profile.name}</strong></h3>
          <p><strong>Created At: </strong> {profile.created_at}</p>
          <p><strong>Updated At: </strong> {profile.updated_at}</p>      
      </div>
    )
  }
}

ProfileDetails.propTypes = {
    profile: T.object
  }
export default ProfileDetails;
