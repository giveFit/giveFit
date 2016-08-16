import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainToolbar from '../components/Header/MainToolbar';
import HomeContainer from '../components/Home/HomeContainer';

import GridContainer from '../components/Feed/GridContainer';

class App extends Component {
	render() {
		return (
			<div> 
				<MainToolbar />
				<HomeContainer />
			</div>
		);
	}
}

export default App;