import React from 'react';

var Main = React.createClass({
	render: function () {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
})

export default Main;