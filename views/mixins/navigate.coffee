events = require 'events'

module.exports =
  navigate: (e) ->
    events.trigger "navigate", @url()