import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class HomeContainer extends Component {
	render(){
		return(
			<div>
			<Card>
			    <CardMedia
			      overlay={<CardTitle title="Find your free fitness community" />}
			    >
			      <img src="http://lorempixel.com/640/480/nature/" />
			    </CardMedia>
			    <CardTitle title="Connect with the people who inspire you to be active"/>
			</Card>
			</div>
		)
	}
}