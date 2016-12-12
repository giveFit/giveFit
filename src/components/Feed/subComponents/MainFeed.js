import React, { PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';

import styles from '../styles.module.css';

class MainFeed extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      expanded: false,
    };
  }
  componentWillReceiveProps(newProps){
    if(newProps.active !== this.props.active && newProps.active === true){
       console.log('i m now active', this.props.data.title);
       const element = findDOMNode(this.refs.root);
       //Scrolls the current element into the visible area of the browser
       element.scrollIntoView({block: "end", behavior: "smooth"});
    }
  }
  handleExpand(){
    this.setState({expanded: true});
    console.log('expanded')
  }
  handleReduce(){
    this.setState({expanded: false});
    console.log('reduced')
  }
  render(){
    const {props} = this;
    return <Card ref='root' key={props.data.id} className={props.active ? styles.cardActive : ""}>
      <CardHeader
        title={props.data.author}
        avatar={props.data.avatar}
      />
      <CardMedia
          overlay={
                  <CardTitle
                    title={props.data.title}
                    /*subtitle={props.data.date}*/
                  />
                }
      >
        <img src={props.data.image} className={styles.img}/>
      </CardMedia>
      <CardText>{props.data.contentSnippet} </CardText>
      <Card expanded={this.state.expanded}>
      <CardText expandable={true}>
      <Tabs >
          <Tab label="Workouts" >
           <div>
             <h2 className={styles.headline}>Tab One</h2>
             <p>
               This is an example tab.
             </p>
             <p>
               You can put any sort of HTML or react component in here. It even keeps the component state!
             </p>

           </div>
          </Tab>
          <Tab label="Comments" >
           <div>
             <h2 style={styles.headline}>Tab Two</h2>
             <p>
               This is another example tab.
             </p>
           </div>
          </Tab>
          </Tabs>
      </CardText>
      </Card>
     {/* <CardText>
        <div>Comments</div>
      </CardText>*/}
      <CardActions >
      {this.state.expanded ? <FlatButton label="Reduce" onTouchTap={this.handleReduce.bind(this)} /> : <FlatButton label="See upcoming workouts" onTouchTap={this.handleExpand.bind(this)} /> } 
      </CardActions>
    </Card>
  }
}



export default MainFeed;
