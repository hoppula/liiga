React = require 'react/addons'
cerebellum = require 'cerebellum'
options = require './options'

appContainer = document.getElementById(options.appId)

options.render = (options={}) ->
  window.scrollTo(0,0)
  document.getElementsByTagName("title")[0].innerHTML = options.title
  React.renderComponent(options.component, appContainer)

options.initialize = (client) ->
  React.initializeTouchEvents(true)

app = cerebellum.client(options)