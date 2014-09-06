director = require 'director'

React = require 'react'
Backbone = require 'exoskeleton'
Backbone.ajax = require './lib/exoskeleton/client_ajax'

events = require 'events'
# shared routes between client & server, basically all public
# GET routes that should get indexed by search engines
sharedRoutes = require './routes'

appContainer = document.getElementById 'app'

render = (options={}) ->
  document.getElementsByTagName("title")[0].innerHTML = options.title
  React.renderComponent(options.component, appContainer)

document.addEventListener "DOMContentLoaded", ->
  React.initializeTouchEvents(true)

  router = director.Router().configure(html5history: true)

  for route, action of sharedRoutes
    do (route, action) ->
      router.on route, ->
        action.apply(@, arguments).then (options) ->
          render(options)
        .fail (error) ->
          console.log "error", error
        .done()

  router.init()

  # TODO: load all team data in one big request,
  # start loading concurrently with teams.json

  # TODO: add 'a:not([data-bypass])' check, skip if target has data-bypass
  document.addEventListener 'click', (event) ->
    target = event.target
    protocol = "#{target.protocol}//"

    if target.href.slice(protocol.length) isnt protocol
      event.preventDefault()
      router.setRoute target.href
