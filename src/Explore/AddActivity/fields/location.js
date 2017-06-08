import React from 'react'
import PropTypes from 'prop-types'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const Location = ({ onChange, places, parkId, errorText = null }) => {
  return (
    <div>
      <span> Choose Location <i className='fa fa-map-marker' /></span>
      <SelectField
        fullWidth
        value={parkId}
        errorText={errorText}
        onChange={(e, index, value) => onChange(value)}
      >
      {places ? places.map((place) => {
        return (
            <MenuItem
              key={`location-${place.id}`}
              value={place.id}
              primaryText={place.title}
            />
        )
      }) : null}
      </SelectField>
    </div>
  )
}

Location.propTypes = {
  onChange: PropTypes.func.isRequired,
  places: PropTypes.array.isRequired,
  parkId: PropTypes.string,
  errorText: PropTypes.string,
}

export default Location
