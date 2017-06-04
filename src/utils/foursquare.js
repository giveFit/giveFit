import axios from 'axios'

// Foursquare api calls
// Explore: https://developer.foursquare.com/docs/venues
export default {
  exploreVenues: ({ lat, lng }, query) => {
    return axios.get('https://api.foursquare.com/v2/venues/explore', {
      params: {
        client_id: process.env.FOURSQUARE_CLIENT_ID_KEY,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET_KEY,
        ll: lat.toString().concat(',' + lng.toString()),
        radius: 5000,
        venuePhotos: 1,
        query,
        m: 'foursquare',
        locale: 'en',
        v: '20140806',
      },
    })
      .then(({ data }) => data.response.groups[0].items)
  },
  getVenueInfoById: (venueId) => {
    return axios.get(`https://api.foursquare.com/v2/venues/${venueId}`, {
      params: {
        client_id: process.env.FOURSQUARE_CLIENT_ID_KEY,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET_KEY,
        v: '20140806',
      },
    })
      .then(({ data }) => data.response.venue)
  },
}
