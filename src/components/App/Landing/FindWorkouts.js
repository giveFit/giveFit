import 'whatwg-fetch';
import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import styles from './styles.module.css';
import geocodeHelper from '../../../utils/geocodeHelper';
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
    findGroupSuggestions : [],
		pos : null
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
      console.log(res);
      this.setState({
        findGroupSuggestions : [
          {
            description : 'Get my location'
          },
          ...res
        ]
      });
    }).catch(err=>{
      this.setState({
        findGroupSuggestions : [
          {
            description : 'Get my location'
          },
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

  onSuggestionSelected = (e, {suggestionIndex,suggestionValue})=>{
    if(suggestionIndex == 0){
      //Get my location
      if (navigator.geolocation) {
					setTimeout(()=>{
						this.component.input.value = 'Fetching location';
					});
					this.component.input.setAttribute(`disabled`,`disabled`);
					navigator.geolocation.getCurrentPosition((position)=>{
						const lat = parseFloat(position.coords.latitude) ,
						lng = parseFloat(position.coords.longitude);
            var latlng = {lat,lng};

           	geocodeHelper({'location': latlng}).then(results => {
							localStorage.removeItem('__find_workouts_address');
							localStorage.setItem('__find_workouts_pos', JSON.stringify(latlng));
							this.setState({
								findGroupInputVal : results[0].formatted_address,
								pos : {
									lat,
									lng
								}
							}, ()=>{
									this.component.input.removeAttribute(`disabled`);
							});
						}).catch(err=>{
							this.component.input.removeAttribute(`disabled`);
						});

          }, function() {
						this.component.input.removeAttribute(`disabled`);
            console.log('your browser does not support geo location');
          });
        } else {
          // Browser doesn't support Geolocation
					this.component.input.removeAttribute(`disabled`);
          console.log('your browser does not support geo location');
        }
    }else{
			localStorage.removeItem('__find_workouts_pos');
			localStorage.setItem('__find_workouts_address',suggestionValue);
		}
  }

	getLatLng=(address)=>{
		return geocodeHelper({address});

	}

  render(){
    const { findGroupInputVal, findGroupSuggestions } = this.state;
    const inputProps = {
     placeholder: 'Enter a place',
     value : findGroupInputVal,
     onChange: this.onSuggestionTextChange,
     className : styles.autocomplete
   };

    return <Autosuggest
       ref={node=>this.component = node}
       suggestions={findGroupSuggestions}
       onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
       onSuggestionsClearRequested={this.onSuggestionsClearRequested}
       getSuggestionValue={getSuggestionValue}
       onSuggestionSelected={this.onSuggestionSelected}
       renderSuggestion={renderSuggestion}
       inputProps={inputProps}
     />
  }
}
