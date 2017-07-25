import React from 'react'
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete'

class AutoForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '' }
    this.onChange = (address) => this.setState({ address })
  }

  handleFormSubmit(event) {
    console.log('asd')
    event.preventDefault()

    geocodeByPlaceId(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  }
  handleSelect (address, placeId) {
    console.log(address, placeId)
    this.setState({ address, placeId })
    geocodeByPlaceId(placeId)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => this.props.onChange( address, placeId, lat, lng ))
  }
  handleEnter (address) {
    geocodeByAddress(address)
      .then(results => {
      console.log('handleEnter results', results)
      })
  }
  // You can do other things with address string or placeId. For example, geocode :)
  render () {
    const cssClasses = {
      root: 'form-group',
      input: 'Demo__search-input',
      autocompleteContainer: 'Demo__autocomplete-container',
    }

    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    }

    return (
      <div className='page-wrapper' style={{width: 350}}>
        <div className='container'>
          <span> Choose Location <i className='fa fa-map-marker' /></span>
        </div>
        <div className='container'>
          <PlacesAutocomplete
            classNames={cssClasses}
            styles={defaultStyles}
            highlightFirstSuggestion={true}
            inputProps={inputProps}
            onEnterKeyDown={this.handleEnter.bind(this)}
            onSelect={this.handleSelect.bind(this)}
          />
        </div>
      </div>
    )
  }
}

const defaultStyles = {
  root: {
    position: 'relative',
    zIndex: 99,
    paddingBottom: '0px',
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #555555',
    width: '100%',
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: '10px',
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa',
  }
}

export default AutoForm
