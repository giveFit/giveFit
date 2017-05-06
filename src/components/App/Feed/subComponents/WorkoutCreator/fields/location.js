import React from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

export default ({ onChange, places, parkId }) => {
  return (
    <div>
      <span> Choose Location <i className='fa fa-map-marker' /></span>
      <SelectField
        fullWidth
        value={parkId}
        onChange={(e, index, value) => onChange(value)}
      >
        {places.map((place) => <MenuItem value={place.id} primaryText={place.title} />)}
      </SelectField>
    </div>
  )
}
