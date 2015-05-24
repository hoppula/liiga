React = require 'react'
cerebellum = require 'cerebellum/client'
renderClient = require 'cerebellum-react/render-client'
options = require './options'
options.routeHandler = require 'cerebellum-react/route-handler'

options.render = renderClient(React, {
  storeId: options.storeId
  appId: options.appId
  prependTitle: "LiigaOpas - "
  convertProps: true
})

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

# enable instantResolve for immediately resolving fetches
options.instantResolve = true

cerebellum(options)
