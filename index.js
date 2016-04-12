// SDK
var buttons = require('sdk/ui/button/action')
var tabs = require('sdk/tabs')
var {setTimeout, clearTimeout, setInterval} = require('sdk/timers')
var self = require('sdk/self')
var notifications = require('sdk/notifications')
var Request = require('sdk/request').Request

// Gardoum
const icon = self.data.url('gardoum.png')
const stream_url = 'https://www.twitch.tv/gardoum'
const json_url = 'https://api.twitch.tv/kraken/channels/gardoum'
const label_off = 'Gardoum est OFF'
const label_live = 'Gardoum est en live!'
const refresh_time = 60000 //ms
var is_live = false

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
      console.log(response)
      let twitch = response.json;
      console.log("Stream: " + twitch.stream)
      console.log("Channel: " + twitch.channel)
    }
  }).get()
}

// Send a notification to user when Gardoum is live
function notify(game) {
  notifications.notify({
    title: label_live,
    text: 'Gardoum joue à ' + game,
    iconURL: icon,
    onClick: openStream
  })
}

// Switch Icon if Gardoum on stream
function toggleIcon() {
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

checkIfLive()
var interval = setInterval(checkIfLive, refresh_time)
