var foursquare = (require('foursquarevenues'))('VHPDS13TSYHT52HYFSPETX2LOWCKIZSTSVAS4MBBAPNRRN1R', 'RI5JKO0G4PGWLHEJ5ORPC4TFZHR3RW5FB5LC2SLODDDNT0NB')

var foursquareConfig = {

}
export default function foursquareHelper (params) {
  return new Promise((resolve, reject) => {
    foursquare.getVenues(params, (error, venues) => {
      if (!error) {
        console.log('venues', venues)
        resolve(venues)
      } else {
        reject(`No results`)
      }
    })
  })
}

foursquare.getVenues(params, function (error, venues) {
  if (!error) {
    console.log(venues)
  }
})

foursquare.exploreVenues(params, function (error, venues) {
  if (!error) {
  			console.log(venues)
  }
})
