import React, { Component, Link } from 'react'
import FontIcon from 'material-ui/FontIcon'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import IconLocationOn from 'material-ui/svg-icons/communication/location-on'

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>
const nearbyIcon = <IconLocationOn />

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
class BottomNav extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedIndex: 0,
    }
    this.select = this.select.bind(this)
  }

  select (index) { this.setState({selectedIndex: index}) };

  render () {
    return (
      <Paper zDepth={1}>
        <div>
            <table width="576" cellSpacing="0" cellPadding="0">
              <tbody>
                <tr>
                  <td>
                    GiveFit
                  </td>
                  <td width="50">
                    <a
                      target="_blank"
                      rel='noopener noreferrer'
                      href="https://www.facebook.com/givefit1"
                    >
                      <img width="30" height="30" src="https://storage.googleapis.com/gd-newsletter/shared-assets/social-facebook.png" alt="Facebook" />
                    </a>
                  </td>
                  <td width="50">
                    <a
                      target="_blank"
                      rel='noopener noreferrer'
                      href="https://twitter.com/give_fit"
                    >
                      <img width="30" height="30" src="https://storage.googleapis.com/gd-newsletter/shared-assets/social-twitter.png" alt="Twitter" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a
                      target="_blank"
                      rel='noopener noreferrer'
                      href="http://madewithloveinbaltimore.org"
                    >
                      Privacy Policy
                    </a>
                  </td>
                  <td>
                    <a
                      target="_blank"
                      rel='noopener noreferrer'
                      href="http://madewithloveinbaltimore.org"
                    >
                      FAQ
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <h4>
                  Contact Us: <br/>
                  Email: jake@givefit.net<br/>
                  Tel: (443) 714-5632<br/>
            </h4>
            <a
              target="_blank"
              rel='noopener noreferrer'
              href="http://madewithloveinbaltimore.org"
            >
              Made with &hearts; in Baltimore
            </a>
            <h4>
              ALL RIGHTS RESERVED ©2017<br/>
            </h4>
        </div>
      </Paper>
    )
  }
}

export default BottomNav
