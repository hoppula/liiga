import React from 'react'
import ReactDOM from 'react-dom/server'
import compress from 'compression'
import Server from 'cerebellum/server'
import Cerebellum from 'cerebellum-react'

import options from './options'
options.prependTitle = "LiigaOpas - "
options.convertProps = true

options.middleware = []

if !process.env.NODE_ENV or (process.env.NODE_ENV is "development")
  webpack = require 'webpack'
  config = require './webpack.config.dev'
  compiler = webpack(config)

  options.middleware.push(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath
  }))

  options.middleware.push(require('webpack-hot-middleware')(compiler))
else
  options.middleware.push(compress())

app = Cerebellum(Server, React, ReactDOM, options)
app.useStatic()

app.listen Number(process.env.PORT or 4000), ->
  console.log "liiga_frontend #{process.env.NODE_ENV or "development"} server listening on port #{@address().port}"
