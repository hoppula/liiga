React = require 'react'
events = require 'events'
director = require 'director'

Backbone = require 'exoskeleton'
Backbone.ajax = require './lib/exoskeleton/client_ajax'

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
    ((route, action) ->
      router.on route, ->
        action.apply(@, arguments).then (options) ->
          render(options)
    )(route, action)

  router.init()

  events.on "navigate", (url) ->
    router.setRoute url
