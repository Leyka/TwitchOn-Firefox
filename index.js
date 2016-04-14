/*
  Author: Skander
  Github: https://github.com/Leyka
  Date: 2016-04-12
*/

// SDK
let buttons = require('sdk/ui/button/action')
let tabs = require('sdk/tabs')
let {clearInterval, setInterval} = require('sdk/timers')
let self = require('sdk/self')
let notifications = require('sdk/notifications')
let Request = require('sdk/request').Request
let _ = require("sdk/l10n").get  // localization

// Config
const streamer = 'Gardoum'
const idle_refresh_time = 30 // default refresh time, in seconds
const active_refresh_time = 60*5 // Slow down refresh time when streamer is live (60s * 5 minutes)
const stream_url = 'https://www.twitch.tv/' + streamer
const json_url = 'https://api.twitch.tv/kraken/streams/' + streamer
const label_off = streamer + ' - OFF'
const label_live = _('is_streaming', streamer)
const icon = self.data.url('gardoum.png')

let is_live = false
let is_notified = false
let refresh_time = idle_refresh_time

// Create Add-on button
let button = buttons.ActionButton({
  id: 'btnOpenStream',
  label: label_off,
  icon: {
    '32': './gardoum.png'
  },
  onClick: openStream,
  badge: 'OFF',
  badgeColor: '#3B3B43'
})

// Open a new tab with the stream
function openStream(state) {
  tabs.open(stream_url)
}

// Check if streamer is streaming
function checkIfLive() {
  // Get data from API Twitch
  let check_live = Request({
    url: json_url,
    overrideMimeType: 'text/plain; charset=latin1',
    onComplete: (response) => {
      let twitch = response.json;
      // No connection
      if (twitch == null) { return }
      // Is live
      if (twitch.stream != null) {
        is_live = true
        let game = twitch.stream.game
        changeStatus()

        // Notify
        if (!is_notified) {
          notify(game)
          is_notified = true
        }
        // Change interval
        else if (refresh_time == idle_refresh_time) {
          refresh_time = active_refresh_time
          setNewInterval()
        }
      }
      else {
        is_live = false
        is_notified = false
        changeStatus()

        // Change interval
        if (refresh_time != idle_refresh_time) {
          refresh_time = idle_refresh_time
          setNewInterval()
        }
      }
    }
  }).get()
}

// Send a notification to user when streamer is live
function notify(game) {
  notifications.notify({
    title: label_live,
    text: _('is_playing', streamer) + ' ' + game,
    iconURL: icon,
    onClick: openStream
  })
}

// Change status of icon when stream is on
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

// Change refresh time to check when Gardoum is live
function setNewInterval() {
  clearInterval(interval)
  interval = setInterval(checkIfLive, refresh_time * 1000)
}

// Start app
checkIfLive()
var interval = setNewInterval()
