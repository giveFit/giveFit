import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import './Edit.css'

export class ProfileEdit extends React.Component {
  handleSubmit (e) {
    e.preventDefault()
    const { profile, auth } = this.props

    auth.updateProfile(profile.user_id, {
      user_metadata: {
        address: ReactDOM.findDOMNode(this.refs.address).value,
      },
    })
  }

  render () {
    const { profile } = this.props
    const { address } = profile.user_metadata || {}

    return (
      <div className='edit'>
          {/* <h3>About Me</h3>
            <br />
            <TextField
              hintText="The hint text can be as long as you want, it will wrap."
            /> */}
            <br />

          {/* <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
            <FormGroup controlId="address">
              <Col componentClass={ControlLabel} sm={2}>
                Address
              </Col>
              <Col sm={10}>
                <FormControl type="text" defaultValue={address} ref="address" />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button type="submit">Save</Button>
              </Col>
            </FormGroup>
          </Form> */}

      </div>
    )
  }
}

ProfileEdit.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

export default ProfileEdit
