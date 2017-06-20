function geocode (options) {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(options, (results, status) => {
      if (status === 'OK') {
        if (results.length) {
          resolve(results)
        } else {
          reject(new Error('No results'))
        }
      } else {
        reject(new Error(`Geocoder failed due to  ${status}`))
      }
    })
  })
}

export default geocode
