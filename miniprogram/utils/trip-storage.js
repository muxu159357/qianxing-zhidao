// trip-storage.js
// Unified qianxing_trips read/write utility (V18)

var TRIPS_KEY = 'qianxing_trips'

function getTrips() {
  try {
    var trips = wx.getStorageSync(TRIPS_KEY) || []
    return Array.isArray(trips) ? trips : []
  } catch (e) {
    return []
  }
}

function saveTrips(trips) {
  wx.setStorageSync(TRIPS_KEY, Array.isArray(trips) ? trips : [])
}

function addTrip(trip) {
  var trips = getTrips()
  trips.push(trip)
  saveTrips(trips)
}

function deleteTrip(tripId) {
  var trips = getTrips()
  var nextTrips = trips.filter(function (item) {
    return String(item.id) !== String(tripId)
  })
  saveTrips(nextTrips)
}

function updateTrip(tripId, patch) {
  var trips = getTrips()
  var nextTrips = trips.map(function (item) {
    if (String(item.id) !== String(tripId)) {
      return item
    }
    var merged = {}
    Object.keys(item).forEach(function (key) { merged[key] = item[key] })
    Object.keys(patch).forEach(function (key) { merged[key] = patch[key] })
    return merged
  })
  saveTrips(nextTrips)
}

module.exports = {
  getTrips: getTrips,
  addTrip: addTrip,
  deleteTrip: deleteTrip,
  updateTrip: updateTrip
}
