import React from 'react'
import PropTypes from 'prop-types'

import ReactFilestack from 'react-filestack'

const PictureURL = ({ onChange }) => {
  return (
    <ReactFilestack
      apikey={process.env.FILESTACK_API}
      options={{
        maxFiles: 1,
      }}
      onSuccess={(res) => {
        onChange(res.filesUploaded[0].url)
      }}
      buttonClass='add_picture_button'
      buttonText={<span><i className='fa fa-plus-circle'></i> Add Picture</span>}
    />
  )
}

PictureURL.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default PictureURL
