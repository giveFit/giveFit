import React from 'react'
import Checkbox from 'material-ui/Checkbox'

export default ({ onCheck, requestTrainer }) => {
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
