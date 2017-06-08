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
      options={{
        maxFiles: 1,
      }}
      onSuccess={(res) => {
        console.log('filestack res', res)
        onChange(res.filesUploaded[0].url)
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
