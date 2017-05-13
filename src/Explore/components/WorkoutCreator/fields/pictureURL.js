import React from 'react'
import ReactFilepicker from 'react-filepicker'

import configKeys from '../../../../../configKeys'

export default ({ onChange }) => {
  return (
    <ReactFilepicker
      apikey={configKeys.FILESTACK_API}
      options={{
        mimetype: 'image/*',
        services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX'],
      }}
      buttonText={`<span><i class='fa fa-plus-circle'></i> Add Picture</span>`}
      onSuccess={(res) => onChange(res.url)}
      buttonClass='add_picture_button'
    />
  )
}
