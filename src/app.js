import styles from './index.scss';
import React from 'react';
import Channels from './channels';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Channels />
        </div>
        <div>
          {
            this.props.children ?
            React.Children.toArray(this.props.children) :
          }
        </div>
      </div>
    )
  }
}
