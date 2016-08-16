import React, { PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class MainFeed extends React.Component{
  render(){
    const workout = this.props.data.toObject();
    return(
      <Card key={workout.id}>
      <CardHeader
        title={workout.author}
        avatar={workout.avatar}
        subtitle={workout.location}
      />
      <CardMedia
        overlay={
                  <CardTitle 
                    title={workout.title} 
                    subtitle={workout.date}
                    /*subtitle={workout.get('date')}*/
                  />
                }
      >
        <img src={workout.image} />
      </CardMedia>
      <CardTitle title={workout.contentSnippet} />
     {/* <CardText>
        <div>Comments</div>
      </CardText>*/}
      <CardActions>
        <FlatButton label="Expand+" />
      </CardActions>
    </Card>
    )
  }
}