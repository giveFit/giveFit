// returns a list of 20 places based on our request options
export function searchNearby (googleMaps, div, request) {
  return new Promise((resolve, reject) => {
    // the api call is within the promise ;)
    const placesService = new googleMaps.places.PlacesService(div)
    // https://developers.google.com/maps/documentation/javascript/examples/place-search
    placesService.nearbySearch(request, (results, status) => {
      if (status === googleMaps.places.PlacesServiceStatus.OK) {
        resolve(results)
      } else {
        reject(new Error('Error'))
      }
    })
  })
}
