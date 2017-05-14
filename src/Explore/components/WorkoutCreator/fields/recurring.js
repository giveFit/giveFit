import React from 'react'
import Checkbox from 'material-ui/Checkbox'

export default ({ onCheck, recurring }) => {
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
