React = require 'react/addons'
cerebellum = require 'cerebellum'
options = require './options'

appContainer = document.getElementById(options.appId)

options.render = (options={}) ->
  document.getElementsByTagName("title")[0].innerHTML = "LiigaOpas - #{options.title}"
  React.render(options.component, appContainer)

options.initialize = (client) ->
  React.initializeTouchEvents(true)

  reRender = ->
    client.router.replace(document.location.pathname)

  client.store.on("fetch:gameEvents", reRender)
  client.store.on("fetch:gameLineups", reRender)
  client.store.on("fetch:gameStats", reRender)
  client.store.on("fetch:schedule", reRender)
  client.store.on("fetch:standings", reRender)
  client.store.on("fetch:stats", reRender)
  client.store.on("fetch:teams", reRender)
  client.store.on("fetch:team", reRender)

options.instantResolve = true

app = cerebellum.client(options)