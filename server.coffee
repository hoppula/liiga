require('coffee-react/register')

React = require 'react'
ReactDOM = require 'react-dom/server'
compress = require 'compression'
Server = require 'cerebellum/server'
Cerebellum = require 'cerebellum-react'

options = require './options'
options.prependTitle = "LiigaOpas - "
options.convertProps = true
options.middleware = [
  compress()
]

app = Cerebellum(Server, React, ReactDOM, options)
app.useStatic()

app.listen Number(process.env.PORT or 4000), ->
  console.log "liiga_frontend development server listening on port #{@address().port}"
