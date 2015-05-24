require('coffee-react/register')

React = require 'react'
compress = require 'compression'
cerebellum = require 'cerebellum/server'
renderServer = require 'cerebellum-react/render-server'

options = require './options'
options.routeHandler = require 'cerebellum-react/route-handler'

options.render = renderServer(React, {
  storeId: options.storeId
  appId: options.appId
  prependTitle: "LiigaOpas - "
  convertProps: true
})

options.middleware = [
  compress()
]

app = cerebellum(options)
app.useStatic()

app.listen Number(process.env.PORT or 4000), ->
  console.log "liiga_frontend development server listening on port #{@address().port}"