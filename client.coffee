director = require 'director'
React = require 'react/addons'

# shared routes between client & server, basically all public
# GET routes that should get indexed by search engines
sharedRoutes = require('./routes')(require('./lib/ajax'))

appContainer = document.getElementById 'app'

render = (options={}) ->
  window.scrollTo(0,0)
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

  document.addEventListener 'click', (event) ->
    target = event.target
    href = target.href
    protocol = "#{target.protocol}//"

    # route only local links with well defined relative paths
    local = document.location.host is target.host
    relativeUrl = href?.slice(protocol.length+target.host.length)
    properLocal = local and relativeUrl.match(/^\//) and not relativeUrl.match(/#$/)

    if properLocal and not event.altKey and not event.ctrlKey and not event.metaKey and not event.shiftKey
      event.preventDefault()
      router.setRoute target.href



