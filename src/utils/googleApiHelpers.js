export function searchNearby(google, map, request) {
	console.log("we did the searchNearby")
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, (results, status, pagination) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {

        resolve(results, pagination);
      } else {
        reject(results, status);
      }
    })
  });
}