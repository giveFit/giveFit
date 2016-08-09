import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

export default class MainToolbar extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      value: 3,
	    };
	}

	handleChange(event, index, value) {
	    this.setState({value});
	}

	render() {
		return(
			 <AppBar
			    title="givefit"
			    iconElementRight={
			      <IconMenu
			        iconButtonElement={
			          <IconButton><MoreVertIcon /></IconButton>
			        }
			        targetOrigin={{horizontal: 'right', vertical: 'top'}}
			        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
			      >
			        <MenuItem primaryText="Refresh" />
			        <MenuItem primaryText="Help" />
			        <MenuItem primaryText="Sign out" />
			      </IconMenu>
			    }
  			/>
		)
	}
}
  

export default MainToolbar;