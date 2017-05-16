import React from 'react'
import PropTypes from 'prop-types'

import Checkbox from 'material-ui/Checkbox'

const RequestTrainer = ({ onCheck, requestTrainer }) => {
  return (
    <div>
      <Checkbox
        name='requestTrainer'
        label='Request Trainer for this activity'
        className='request_trainer'
        checked={requestTrainer}
        onCheck={() => onCheck()}
      />
    </div>
  )
}

RequestTrainer.propTypes = {
  onCheck: PropTypes.func.isRequired,
  requestTrainer: PropTypes.bool.isRequired,
}

export default RequestTrainer
