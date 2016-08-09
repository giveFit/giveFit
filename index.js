import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { queryReducer } from "./app/reducers/reducer.js";
import thunkMiddleware from "redux-thunk";
import { QueryContainer } from "./app/components/Query.js"

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MainToolbar from './app/components/MainToolbar';
import GridContainer from './app/containers/GridContainer';

injectTapEventPlugin();

const Main = React.createClass({
  render: () => {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <GridContainer />
      </MuiThemeProvider>
    )
  }
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
  )(createStore)

ReactDOM.render( <Main />, document.getElementById("example"))
