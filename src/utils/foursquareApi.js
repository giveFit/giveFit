import FourSquare from 'react-native-foursquare-api'

var foursquare = FourSquare({
  clientID: process.env.FOURSQUARE_CLIENT_ID_KEY,
  clientSecret: process.env.FOURSQUARE_CLIENT_SECRET_KEY,
})

export default foursquare
