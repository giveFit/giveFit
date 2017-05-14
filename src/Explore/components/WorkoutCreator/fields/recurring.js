import React from 'react'
import PropTypes from 'prop-types'

import Checkbox from 'material-ui/Checkbox'

const Recurring = ({ onCheck, recurring }) => {
  return (
    <div>
      <Checkbox
        name='recurring'
        label='Recurrinng'
        className='request_trainer'
        checked={recurring}
        onCheck={() => onCheck()}
      />
    </div>
  )
}

Recurring.propTypes = {
  onCheck: PropTypes.func.isRequired,
  recurring: PropTypes.bool.isRequired,
}

export default Recurring
