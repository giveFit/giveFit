import React from 'react'
import PropTypes from 'prop-types'

import Toggle from 'material-ui/Toggle'

const Public = ({ onChange, errorText = null }) => {
  return (
    <Toggle
      label="Public"
      defaultToggled={true}
      labelPosition="right"
      style={styles.toggle}
      // onToggle={() => this.context.router.push('/')}
    />
  )
}

Public.propTypes = {
  onChange: PropTypes.func,
  errorText: PropTypes.string,
}

Public.contextTypes = {
  router: PropTypes.object.isRequired,
}

const styles = {
  toggle: {
    marginBottom: 16,
  },
}

export default Public
