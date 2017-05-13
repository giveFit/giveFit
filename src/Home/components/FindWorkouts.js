import React from 'react'
import Autosuggest from 'react-autosuggest'
import geocodeHelper from 'utils/geocodeHelper'

export default class FindWorkouts extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      findGroupInputVal: '',
      findGroupSuggestions: [],
      pos: null,
    }
  }

  onSuggestionTextChange (event, { newValue }) {
    this.setState({
      findGroupInputVal: newValue,
    })
  }

  getSuggestions (inputValue) {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.places.AutocompleteService()

      service.getQueryPredictions({ input: inputValue }, (predictions, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          return reject(status)
        }

        return resolve(predictions)
      })
    })
  }

  onSuggestionsFetchRequested ({ value }) {
    const inputValue = value.trim().toLowerCase()

    if (inputValue.length < 1) {
      return
    }

    this.getSuggestions(value)
      .then((res) => {
        this.setState({
          findGroupSuggestions: [
            {
              description: 'Use my location',
            },
            ...res,
          ],
        })
      })
      .catch((err) => {
        console.log(err)

        this.setState({
          findGroupSuggestions: [{
            description: 'Use my location',
          }],
        })
      })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested () {
    this.setState({
      findGroupSuggestions: [],
    })
  }

  onSuggestionSelected (e, { suggestionIndex, suggestionValue }) {
    if (suggestionIndex == 0) {
      // Get my location
      if (navigator.geolocation) {
        setTimeout(() => {
          this.component.input.value = 'Loading...'
        })

        this.component.input.setAttribute(`disabled`, `disabled`)

        navigator.geolocation.getCurrentPosition((position) => {
          const lat = parseFloat(position.coords.latitude)
          const lng = parseFloat(position.coords.longitude)
          var latlng = { lat, lng }

          geocodeHelper({'location': latlng})
            .then((results) => {
              window.localStorage.removeItem('__find_workouts_address')
              window.localStorage.setItem('__find_workouts_pos', JSON.stringify(latlng))

              this.setState({
                findGroupInputVal: results[0].formatted_address,
                pos: {
                  lat,
                  lng,
                },
              }, () => {
                this.component.input.removeAttribute(`disabled`)
              })
            })
            .catch((err) => {
              this.component.input.removeAttribute(`disabled`)
            })
        }, () => {
          this.component.input.removeAttribute(`disabled`)
        })
      } else {
        // Browser doesn't support Geolocation
        this.component.input.removeAttribute(`disabled`)
      }
    } else {
      window.localStorage.removeItem('__find_workouts_pos')
      window.localStorage.setItem('__find_workouts_address', suggestionValue)
    }
  }

  getLatLng (address) {
    return geocodeHelper({address})
  }

  render () {
    const { findGroupInputVal, findGroupSuggestions } = this.state
    const inputProps = {
      placeholder: 'Enter a location',
      value: findGroupInputVal,
      onChange: (...args) => this.onSuggestionTextChange(...args),
      className: 'autocomplete',
    }

    const renderSuggestion = (suggestion) => (
      <div style={{background: 'white'}}>
        {suggestion.description}
      </div>
    )

    return (
      <Autosuggest
        ref={(node) => {
          this.component = node
        }}
        suggestions={findGroupSuggestions}
        onSuggestionsFetchRequested={(...args) => this.onSuggestionsFetchRequested(...args)}
        onSuggestionsClearRequested={() => this.onSuggestionsClearRequested()}
        getSuggestionValue={(suggestion) => suggestion.description}
        onSuggestionSelected={(...args) => this.onSuggestionSelected(...args)}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    )
  }
}

/*
Another example:
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TextField } from 'material-ui'

export default class AddressAutocomplete extends Component {
  static propTypes = {
    value: PropTypes.string,
    floatingLabelText: PropTypes.string,
    hintText: PropTypes.string,
    onChange: PropTypes.func
  }

  componentWillMount () {
    this.setState({ value: this.props.value || '' })
  }

  componentDidMount () {
    const input = document.getElementById('addressAutocompleteField')
    const options = {
      componentRestrictions: {country: 'fr'},
      types: ['address']
    }
    const geoAutocomplete = new window.google.maps.places.Autocomplete((input), options)
    geoAutocomplete.addListener('place_changed', () => {
      const selectedPlace = geoAutocomplete.getPlace()
      const componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      }
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      let selectedSuggest = {}
      for (let addressComponent of selectedPlace.address_components) {
        const addressType = addressComponent.types[0]
        if (componentForm[addressType]) {
          selectedSuggest[addressType] = addressComponent[componentForm[addressType]]
        }
      }
      // input.value = selectedPlace.name // Code injection risk (check doc)
      input.value = `${selectedSuggest.street_number}, ${selectedSuggest.route}`
      this.props.onChange(selectedSuggest)
    })
  }

  _handleChange = (event, value) => this.setState({ value })

  render () {
    return (
      <TextField
        id='addressAutocompleteField'
        floatingLabelText={this.props.floatingLabelText}
        hintText={this.props.hintText}
        value={this.state.value}
        onChange={this._handleChange}
        placeholder=''
        fullWidth
      />
    )
  }
} */
