import 'whatwg-fetch';
import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import styles from './styles.module.css';

const getSuggestions = (value) => {
  //console.log('value',value);
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  if(inputLength < 3){
    return Promise.resolve([]);
  }else{
    try{
       return window.fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${inputValue}&key=AIzaSyDaqZIUzhyOdPDlsVjkdLbuWj89F3gNCMg`).then(r=>r.json()).then(res=>res.results);
    } catch(err){
      return Promise.resolve([]);
    }
  }
};

const getSuggestionValue = suggestion => suggestion.name;


const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);


export default class FindWorkouts extends Component{
  state = {
    findGroupInputVal : '',
    findGroupSuggestions : []
    //hintText: "Enter a location"
  }
  onSuggestionTextChange = (event, { newValue }) => {
    //console.log('newValue',newValue);
    this.setState({
      findGroupInputVal: newValue
    });
  };

  onSuggestionsFetchRequested = ({value}) => {
    if(value.length<3){
      return;
    }
        //console.log('value',value);
    const findGroupSuggestions =  getSuggestions(value).then(res=>{
      //console.log(res);
      this.setState({
        findGroupSuggestions : res
      });
    });

  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      findGroupSuggestions: []
    });
  };

  render(){
    const { findGroupInputVal, findGroupSuggestions } = this.state;
    const inputProps = {
     placeholder: 'Enter a place',
     value : findGroupInputVal,
     onChange: this.onSuggestionTextChange,
     className : styles.autocomplete
   };

    return <Autosuggest
       suggestions={findGroupSuggestions}
       onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
       onSuggestionsClearRequested={this.onSuggestionsClearRequested}
       getSuggestionValue={getSuggestionValue}
       renderSuggestion={renderSuggestion}
       inputProps={inputProps}
     />
  }
}
