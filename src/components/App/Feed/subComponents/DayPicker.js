import React, {Component} from 'react';
import {Tab, Tabs, Slider, FlatButton} from 'material-ui';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import List from 'material-ui/svg-icons/action/list';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

//Local
import GroupCreatorWithData from './GroupCreator';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
   block: {
    maxWidth: 250,
  },
  radioButton1: {
    marginBottom: 16,
    float: "left"
  },
  radioButton2: {
    marginBottom: 16,
    display: "inline"
  },
  toolbar: {
    background: '#D01F3C',
    paddingTop: 15
  }
};

class DayPicker extends Component{
	constructor(props){
		super(props)
		console.log('props of daypicker', props)
		this.state = {
	      value: 1,
	    };
	}
	handleActive(tab) {
	  alert(`A tab with this route property ${tab.props['data-route']} was activated.`);
	}

	handleChange(event, index, value){
		this.setState({value: value})
	};

	render(){
		const {props} = this;
		return(
			<div className={props.className || ''}>
				<Toolbar style={styles.toolbar}>
			        <ToolbarGroup firstChild={true}>
			          <DropDownMenu value={this.state.value} onChange={this.handleChange.bind(this)}>
			            <MenuItem value={1} primaryText="All Tribes" />
			            <MenuItem value={2} primaryText="Community-based" />
			            <MenuItem value={3} primaryText="Gyms" />
			            <MenuItem value={4} primaryText="Studios" />
			            <MenuItem value={5} primaryText="Meetup groups" />
			          </DropDownMenu>
			        </ToolbarGroup>
			        <ToolbarGroup>
				        <GroupCreatorWithData
							geocoder={props.geocoder}
							profile={props.profile}
						/>
			        </ToolbarGroup>
      			</Toolbar>
				
			      {/*<RadioButton
			        value="light"
			        label="Community-based"
			        style={styles.radioButton1}
			      />
			      <RadioButton
			        value="not_light"
			        label="Local gyms"
			        style={styles.radioButton2}
			      />*/}
			    
			</div>
		)
	}
}

export default DayPicker;