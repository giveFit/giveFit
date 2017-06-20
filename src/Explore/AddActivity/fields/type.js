import React from 'react'
import PropTypes from 'prop-types'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const Type = ({ onChange, value, errorText = null }) => {
  return (
    <SelectField
      floatingLabelText='Type'
      value={value}
      errorText={errorText}
      onChange={(e, index, value) => onChange(value)}
    >
      <MenuItem value={'Walk'} primaryText='Walk' />
      <MenuItem value={'Yoga'} primaryText='Yoga' />
      <MenuItem value={'Bootcamp'} primaryText='Bootcamp' />
      <MenuItem value={'Zumba'} primaryText='Zumba' />
      <MenuItem value={'Dance'} primaryText='Dance' />
      <MenuItem value={'Run'} primaryText='Run' />
      <MenuItem value={'Group Fitness'} primaryText='Group Fitness' />
      <MenuItem value={'Line Dancing'} primaryText='Line Dancing' />
      <MenuItem value={'Crossfit'} primaryText='Crossfit' />
    </SelectField>
  )
}

Type.propTypes = {
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  value: PropTypes.string,
}

export default Type
