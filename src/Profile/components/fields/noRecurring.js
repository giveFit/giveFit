import React from 'react'
import PropTypes from 'prop-types'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const NoRecurring = ({ onChange, errorText = null, value }) => {
  return (
    <div>
      <SelectField
        floatingLabelText="Number of weeks"
        autoWidth={true}
        value={value}
        onChange={(event, index, value) => onChange(value)}
      >
        <MenuItem value={1} primaryText="1" />
        <MenuItem value={2} primaryText="2" />
        <MenuItem value={3} primaryText="3" />
        <MenuItem value={4} primaryText="4" />
        <MenuItem value={5} primaryText="5" />
        <MenuItem value={6} primaryText="6" />
        <MenuItem value={7} primaryText="7" />
        <MenuItem value={8} primaryText="8" />
        <MenuItem value={9} primaryText="9" />
        <MenuItem value={10} primaryText="10" />
        <MenuItem value={11} primaryText="11" />
        <MenuItem value={12} primaryText="12" />
      </SelectField>
    </div>
  )
}

NoRecurring.propTypes = {
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  value: PropTypes.number,
}

export default NoRecurring
