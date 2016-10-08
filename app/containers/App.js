import React, { Component, PropTypes } from 'react';

import MainToolbar from '../components/Header/MainToolbar';
import HomeContainer from '../components/Home/HomeContainer';

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
