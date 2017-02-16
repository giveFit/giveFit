import React from 'react';
import HomeLoggedInWithData from './components/App/Landing/HomeLoggedIn';
import LoggedInToolbarWithData from './components/App/Header/LoggedInToolbar';
import BottomNav from './components/App/Landing/SubComponents/BottomNavigation';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <LoggedInToolbarWithData />
        </div>
        {<div>
          { this.props.children ?
            React.Children.toArray(this.props.children) : null }
        </div>}
        {/*<div>
          <BottomNav />
        </div>*/}
      </div>
    )
  }
}
