import React, { PropTypes } from 'react';
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
  console.log("grid component props");
  console.log(props);
  console.log("grid component props");
  console.log("grid component props.workouts");
  console.log(props.workouts[0]);
  console.log("grid component props.workouts");
  console.log("grid component props.workouts nodes entry");
  console.log(props.workouts[0]);
  console.log("grid component props.workouts nodes entry");
  return (
        <div>  
         <GridList
            style={styles.gridList}
            cols={1}
            cellHeight={500}
            padding={1}
          >
            {props.workouts.map((item, index) => (
      
                 <MainFeed 
                    key={index}
                    data={item._root.nodes.entry}
                 />
            ))}
          </GridList>
        </div>
          
    );
} 
 
GridComponent.propTypes = {
  workouts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    time: PropTypes.string.isRequired,
    location: PropTypes.string,
    author: PropTypes.string,
    contentSnippet: PropTypes.string,
    tags: PropTypes.string,
    day: PropTypes.string,
    image: PropTypes.string,
    avatar: PropTypes.string,
    id: PropTypes.string,
  })).isRequired,
};
export default GridComponent;
