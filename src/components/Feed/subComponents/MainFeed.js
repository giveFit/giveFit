import React, { PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';

import styles from '../styles.module.css';

class MainFeed extends React.Component{
    componentWillReceiveProps(newProps){
      if(newProps.active !== this.props.active && newProps.active === true){
         console.log('i m now active', this.props.data.title);
         const element = findDOMNode(this.refs.root);
         element.scrollIntoView({block: "end", behavior: "smooth"});
      }
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
        <CardText expandable={true}>
        <Tabs >
            <Tab label="Upcoming Workouts" >
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
       {/* <CardText>
          <div>Comments</div>
        </CardText>*/}
        <CardActions actAsExpander={true}
        showExpandableButton={true}
>
          <FlatButton label="Share" />
        </CardActions>
      </Card>
    }
}



export default MainFeed;
