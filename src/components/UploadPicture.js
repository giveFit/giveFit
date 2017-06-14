import React from 'react'
import PropTypes from 'prop-types'

import FontIcon from 'material-ui/FontIcon'
import ReactFilestack from 'react-filestack'

const UploadPicture = ({ iconColor = 'black', icon = 'add_a_photo', onChange }) => {
  const buttonText = () => {
    return (
      <FontIcon
        className='material-icons'
        color={iconColor}
      >
        {icon}
      </FontIcon>
    )
  }

  return (
    <ReactFilestack
      apikey={process.env.FILESTACK_API}
      mode={'pick'}
      accept={'image/*'}
      options={{
        maxFiles: 1,
      }}
      onSuccess={(res) => {
        onChange(`https://process.filestackapi.com/${process.env.FILESTACK_API}/resize=width:468,height:310,fit:crop,align:center/`.concat(res.filesUploaded[0].url))
      }}
      buttonClass='add_picture_button'
      buttonText={buttonText()}
    />
  )
}

UploadPicture.propTypes = {
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default UploadPicture
