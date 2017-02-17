import 'whatwg-fetch';
import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import styles from './styles.module.css';

const getSuggestions = (value) => {
  //console.log('value',value);
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  if(inputLength < 1){
    return Promise.resolve([]);
  }else{
    try{
			return new Promise((resolve,reject)=>{
				var service = new google.maps.places.AutocompleteService();
				service.getQueryPredictions({ input: inputValue }, (predictions,status)=>{
					if (status != google.maps.places.PlacesServiceStatus.OK) {
						 return reject(status);
					}
					 return resolve(predictions);
				});
			});
    } catch(err){
      return Promise.resolve([]);
    }
  }
};

const getSuggestionValue = suggestion => suggestion.description;


const renderSuggestion = suggestion => (
  <div style={{background : 'white'}}>
    {suggestion.description}
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
    if(value.length<1){
      return;
    }
        //console.log('value',value);
    const findGroupSuggestions =  getSuggestions(value).then(res=>{
      //console.log(res);
      this.setState({
        findGroupSuggestions : [
          {
            description : 'Get my location'
          },
          ...res
        ]
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
       onSuggestionSelected={(...args)=>console.log(...args)}
       renderSuggestion={renderSuggestion}
       inputProps={inputProps}
     />
  }
}
