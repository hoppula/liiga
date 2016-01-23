React = require 'react'
ReactDOM = require 'react-dom'
Client = require 'cerebellum/client'
Cerebellum = require 'cerebellum-react'

options = require './options'
options.prependTitle = "LiigaOpas - "
options.convertProps = true
options.initialize = (client) ->
  reRender = (err ) ->
    if err
      console.log "Fetch error", err
    else
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

Cerebellum(Client, React, ReactDOM, options)
