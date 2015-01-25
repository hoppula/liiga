require('node-cjsx').transform()

React = require 'react/addons'
compress = require 'compression'
cerebellum = require 'cerebellum'
options = require './options'

appId = options.appId

options.render = (document, options={}) ->
  document("title").html "LiigaOpas - #{options.title}"
  document("##{appId}").html React.renderToString(options.component)
  document.html()

options.middleware = [
  compress()
]

app = cerebellum.server(options)
app.useStatic()

app.listen Number(process.env.PORT or 4000), ->
  console.log "liiga_frontend development server listening on port #{@address().port}"