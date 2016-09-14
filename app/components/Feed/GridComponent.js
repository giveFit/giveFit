import React, { PropTypes } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import GridList from 'material-ui/GridList'

import MainFeed from './subComponents/MainFeed';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 500,
    overflowY: 'auto',
    marginBottom: 24,
  },
};

function GridComponent (props) {
  return (
        <div>  
         <GridList
            style={styles.gridList}
            cols={1}
            cellHeight={500}
            padding={1}
          >
            {props.workouts.map((item, index) => (
                 <div key={index}> {!item || 
                  (<MainFeed 
                    data={item}
                 />)} </div>
                 
            ))}
          </GridList>
        </div>
          
    );
} 
 
export default GridComponent;