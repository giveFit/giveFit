import React from 'react'
import PropTypes from 'prop-types'

import ReactFilepicker from 'react-filepicker'

const PictureURL = ({ onChange }) => {
  return (
    <ReactFilepicker
      apikey={process.env.FILESTACK_API}
      options={{
        mimetype: 'image/*',
        services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX'],
      }}
      buttonText={`<span><i class='fa fa-plus-circle'></i> Add Picture</span>`}
      onSuccess={(res) => onChange(res.url)}
      buttonClass='add_picture_button'
      mode='pickAndStore'
    />
  )
}

PictureURL.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default PictureURL
