import React, { PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const Group = (props) => (
    <Card >
      <CardTitle 
        title={props.title} 
        subtitle={props.location}
      />
      <CardMedia
        overlay={
                  <CardTitle 
                    title={props.workoutName} 
                    subtitle={props.date}
                  />
                }
      >
        <img src={props.image} />
      </CardMedia>
       <CardHeader
        title={props.author}
        avatar={props.avatar}
      />
      <CardTitle title={props.contentSnippet} />
     
      <CardActions>
        <FlatButton label="Expand+" />
      </CardActions>
    </Card>
);

export default Group;