// SDK
var buttons = require('sdk/ui/button/action')
var tabs = require('sdk/tabs')
var {setTimeout, clearInterval, setInterval} = require('sdk/timers')
var self = require('sdk/self')
var notifications = require('sdk/notifications')
var Request = require('sdk/request').Request

// Gardoum
const icon = self.data.url('gardoum.png')
const stream_url = 'https://www.twitch.tv/gardoum'
const json_url = 'https://api.twitch.tv/kraken/streams/domingo'
const label_off = 'Gardoum est OFF'
const label_live = 'Gardoum est en live!'
var is_live = false
var is_notified = false

// Create Add-on button
var button = buttons.ActionButton({
  id: 'btnGardoum',
  label: label_off,
  icon: {
    '32': './gardoum.png'
  },
  onClick: openStream,
  badge: 'OFF',
  badgeColor: '#3B3B43'
})

// Open a new tab with Gardoum stream
function openStream(state) {
  tabs.open(stream_url)
}

// Check if Gardoum is streaming
function checkIfLive() {
  // Get data from API Twitch
  let check_live = Request({
    url: json_url,
    overrideMimeType: 'text/plain; charset=latin1',
    onComplete: (response) => {
      let twitch = response.json;

      // Is live
      if (twitch.stream != null) {
        is_live = true
        let game = twitch.stream.game

        if(!is_notified) {
          notify(game)
          is_notified = true
        }
        
        setNewInterval(60*10) // Check each 10 minutes
        changeStatus()
      }
      else {
        is_live = false
        is_notified = false
        setNewInterval(30) // Check each 30 seconds
        changeStatus()
      }
    }
  }).get()
}

// Send a notification to user when Gardoum is live
function notify(game) {
  notifications.notify({
    title: label_live,
    text: 'joue à ' + game,
    iconURL: icon,
    onClick: openStream
  })
}

// Change status of icon if Gardoum on stream
function changeStatus() {
  if (is_live) {
    button.label = label_live
    button.badge = 'LIVE'
    button.badgeColor = '#2CBC67'
  }
  else {
    button.label = label_off
    button.badge = 'OFF'
    button.badgeColor = '#3B3B43'
  }
}

// Change refresh time in SECONDS
function setNewInterval(time_in_sec) {
  clearInterval(interval)
  time_in_sec *= 1000
  interval = setInterval(checkIfLive, time_ms)
}

checkIfLive()
setNewInterval(30) // Check each 30 seconds
