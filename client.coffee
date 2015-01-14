React = require 'react/addons'
cerebellum = require 'cerebellum'
options = require './options'

appContainer = document.getElementById(options.appId)

options.render = (options={}) ->
  document.getElementsByTagName("title")[0].innerHTML = "Liiga.pw - #{options.title}"
  React.render(options.component, appContainer)

options.initialize = (client) ->
  React.initializeTouchEvents(true)

app = cerebellum.client(options)