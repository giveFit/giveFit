var querystring = require('querystring')
var https = require('https')
var jf = require('jsonfile')
var moment = require('moment')
var argv = require('minimist')(process.argv.slice(2))
var config = require('./meetupConfig')

// private

function requestJson (url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      var buffer = []
      res.on('data', Array.prototype.push.bind(buffer))
      res.on('end', function () {
        var text = buffer.join('')
        var json = JSON.parse(text)

        if (res.statusCode < 400) {
          resolve(json)
        } else {
          console.error('Err! HTTP status code:', res.statusCode, url)
          reject(Error(text))
        }
      })
    }).on('error', function (err) {
      console.error('Err! HTTP request failed:', err.message, url)
      reject(err)
    })
  })
}

function isValidGroup (row) {
  var blacklistGroups = config.blacklistGroups || []
  var blacklistWords = config.blacklistWords || []
  var blacklistRE = new RegExp(blacklistWords.join('|'), 'i')

  return blacklistWords.length === 0 ? true : !row.name.match(blacklistRE) &&
         !blacklistGroups.some(function (id) { return row.id === id }) &&
         row.country === (config.meetupParams.country || row.country)
}

function saveToJson (data) {
  var outputFile = argv['o'] || config.outfile

  if (outputFile) {
    jf.writeFile(outputFile, data, function (err) {
      if (err) console.error(err)
    })
  } else {
    process.stdout.write(JSON.stringify(data))
  }
}

function waitAllPromises (arr) {
  if (arr.length === 0) return resolve([])

  return new Promise(function (resolve, reject) {
    var numResolved = 0
    function save (i, val) {
      arr[i] = val
      if (++numResolved === arr.length) {
        resolve(arr)
      }
    }

    arr.forEach(function (item, i) {
      item.then(function (val) {
        save(i, val)
      }).catch(function (err) {
        save(i, {'error': err}) // resolve errors
      })
    })
  })
}

// omitted the last two arguments to the reduce function since they are not being used.
function addEvent (events, event) {
  if (!(event.next_event && event.next_event.time)) {
    return events
  }

  var entry = event.next_event

  entry.group_name = event.name
  entry.group_url = event.link
  entry.url = 'http://meetup.com/' + event.urlname + '/events/' + entry.id
  entry.formatted_time = moment.utc(entry.time + entry.utc_offset).format('DD MMM, ddd, h:mm a')
  events.push(entry)

  return events
}

// public

function getAllMeetupEvents () { // regardless of venue
  var url = 'https://api.meetup.com/2/groups?' +
    querystring.stringify(config.meetupParams)

  return requestJson(url).then(function (data) {
    return data.results.filter(isValidGroup).reduce(addEvent, [])
  }).catch(function (err) {
    console.error('Error getAllMeetupEvents():' + err)
  })
}

function getMeetupEvents () { // events with venues
  return getAllMeetupEvents().then(function (events) {
    var venues = events.map(function (event) {
      return requestJson('https://api.meetup.com/2/event/' +
        event.id +
        '?fields=venue_visibility&key=' +
        config.meetupParams.key)
    })

    return waitAllPromises(venues).then(function (venues) {
      var eventsWithVenues = events.filter(function (evt, i) {
        return venues[i].hasOwnProperty('venue') ||
          venues[i].venue_visibility === 'members'
      })

      saveToJson(eventsWithVenues)
      return eventsWithVenues
    }).catch(function (err) {
      console.error('Error getMeetupEvents(): ' + err)
    })
  })
}

getMeetupEvents()

module.exports = {
  getAllMeetupEvents: getAllMeetupEvents,
  getMeetupEvents: getMeetupEvents,
}
/* const got = require('got')

module.exports = function (options) {
  // options.key => API key
  // options.category => Comma separeted list of categories to search for
  // options.country => Country code to search for (ex: ar)
  // options.lon => Longitude to center the radius of search
  // options.lat => Latitude to center the radius of search
  // options.radius => Radius on miles to search
  return getMeetups(options)
    .then(meetups => meetups.map(meetup => getEvents(meetup.urlname)))
    .then(eventsProms => Promise.all(eventsProms))
    .then(eventsLists => eventsLists.reduce((output, events) => output.concat(events), []))
}

function getEvents (meetupID) {
  return got(`https://api.meetup.com/${meetupID}/events`)
    .then(res => JSON.parse(res.body))
    .then(meetups => meetups.map(mapEventToCommonOutput))
}

function mapEventToCommonOutput (event) {
  return {
    id: event.id,
    name: event.name,
    total_capacity: event.rsvp_limit,
    time: new Date(event.time),
    attendees: event.yes_rsvp_count,
    waitinglist: event.waitinglist_count,
    location: event.venue ? {
      name: event.venue.name,
      address: event.venue.address_1,
      city: event.venue.city,
      country: event.venue.country
    } : null,
    link: event.link,
    description: event.description,
    visibility: event.visibility,
    meetup: {
      name: event.group.name,
      link: `https://www.meetup.com/${event.group.urlname}`
    }
  }
}

function getMeetups (options) {
  return got(`https://api.meetup.com/find/groups`, {
    query: {
      category: options.category,
      sign: true,
      key: options.key,
      country: options.country,
      lon: options.lon,
      lat: options.lat,
      radius: options.radius
    }
  }).then(res => JSON.parse(res.body))
} */
