import React, { PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class MainFeed extends React.Component{
  render(){
    const workout = this.props.data
    return(
      <Card key={workout.get('id')}>
      <CardHeader
        title={workout.get('author')}
        avatar={workout.get('avatar')}
        subtitle={workout.get('location')}
      />
      <CardMedia
        overlay={
                  <CardTitle 
                    title={workout.get('title')} 
                    subtitle={workout.get('date')}
                    /*subtitle={workout.get('date')}*/
                  />
                }
      >
        <img src={workout.get('image')} />
      </CardMedia>
      <CardTitle title={workout.get('contentSnippet')} />
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