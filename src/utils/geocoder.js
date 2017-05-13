module.exports = function (obj, callback) {
  const { map } = this._googleMapComponent.props
  // var input = "40,-90";
  // var latlngStr = input.split(',', 2);

  var latLng = {lat: obj.latLng.lat(), lng: obj.latLng.lng()}

  this.geocoder.geocode({'location': obj.latLng}, (results, status) => {
    if (status === 'OK') {
      if (results[1]) {
        // map.setZoom(9);
        // map.setCenter(latlng);
        var marker = new window.google.maps.Marker({
          position: latLng,
          icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
          map: map,
        })
        if (this.clickMarker) {
          this.clickMarker.setMap(null)
        }
        this.clickMarker = marker
        this.infowindow.setContent(results[1].formatted_address)
        this.props.onPlaceSelect({
          coordinates: latLng,
          address: results[1].formatted_address,
        })
        this.infowindow.open(map, marker)
      } else {
        // window.alert('No results found');
      }
    } else {
      // window.alert('Geocoder failed due to: ' + status);
    }
    callback(null, this.clickMarker, latLng)
  })
}
