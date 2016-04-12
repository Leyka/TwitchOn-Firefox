let self = require('sdk/self')
let buttons = require('sdk/ui/button/action')
let tabs = require('sdk/tabs')

let stream_url = 'https://www.twitch.tv/gardoum'

let button = buttons.ActionButton({
  id: 'btnGardoum',
  label: 'Gardoum Live',
  icon: {
    '16': './gardoum_off.png',
    '32': './gardoum.png'
  },
  onClick: openStream
})


function openStream(state) {
  tabs.open(stream_url)
}
