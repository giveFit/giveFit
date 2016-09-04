import React, { PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const Group = (props) => (
    <Card >
      <CardHeader
        title={props.author}
        avatar={props.avatar}
        subtitle={props.location}
      />
      <CardMedia
        overlay={
                  <CardTitle 
                    title={props.title} 
                    subtitle={props.date}
                    /*subtitle={props.data.date}*/
                  />
                }
      >
        <img src={props.image} />
      </CardMedia>
      <CardTitle title={props.contentSnippet} />
     
      <CardActions>
        <FlatButton label="Expand+" />
      </CardActions>
    </Card>
);

export default Group;