import React from 'react';
import HomeLoggedInWithData from './components/App/Landing/HomeLoggedIn';
import LoggedInToolbar from './components/App/Header/LoggedInToolbar';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <HomeLoggedInWithData />
        </div>
        {/*<div>
          { this.props.children ?
            React.Children.toArray(this.props.children) : null }
        </div>*/}
      </div>
    )
  }
}
