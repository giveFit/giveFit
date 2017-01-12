import React, {Component} from 'react';
import {Tab, Tabs, Slider} from 'material-ui';
import GroupCreator from './GroupCreator';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class DayPicker extends Component{
	constructor(props){
		super(props)
		console.log('props of daypicker', props)
	}
	handleActive(tab) {
	  alert(`A tab with this route property ${tab.props['data-route']} was activated.`);
	}
	render(){
		const {props} = this;
		return(
			<div>
				<Tabs>
				    <Tab label="Mon" />
				    <Tab label="Tues" />
				   	<Tab label="Wed" />
				    <Tab label="Thurs" />
				    <Tab label="Fri" />
				    <Tab label="Sat" />
				    <Tab label="Sun" />
				  </Tabs>
				<div>
					<GroupCreator geocoder={props.geocoder}/>
				</div>
			</div>
		)
	}
}

export default DayPicker;