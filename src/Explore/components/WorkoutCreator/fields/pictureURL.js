import React from 'react'
import ReactFilepicker from 'react-filepicker'

export default ({ onChange }) => {
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
    />
  )
}
