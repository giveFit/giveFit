var React = require('react');

var Main = React.createClass({
	render: function () {
		return (
			<div>
				{React.cloneElement({this.props.children}, this.props)}
			</div>
		)
	}
})

module.exports = Main;