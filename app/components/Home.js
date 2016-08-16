import React from 'react';
import { bindActionCreators, createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { queryReducer } from '../reducers/reducer.js';
import configStore from '../store/configStore';
import thunkMiddleware from "redux-thunk";
import App from '../containers/App'

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

/*const store = configStore();
*/
const Home = React.createClass({
	render: () => {
		return(
			<Provider store={createStoreWithMiddleware(queryReducer)}>
			{/*Working on alternative implementation
			<Provider store={store}>*/}
				<App />
			</Provider>
		)
	}
}) 

module.exports = Home;