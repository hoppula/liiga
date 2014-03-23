express = require 'express'
path = require 'path'
app = express()

React = require 'react'
Backbone = require 'exoskeleton'
Backbone.ajax = require './lib/exoskeleton/server_ajax'

fs = require "fs"
cheerio = require 'cheerio'
#jsdom = require("jsdom").jsdom
#document = jsdom(fs.readFileSync('./public/index.html', encoding: "UTF-8"))
#window = document.parentWindow
#appContainer = document.getElementById 'app'

document = cheerio.load(fs.readFileSync('./public/index.html', encoding: "UTF-8"))

extractParams = (params) ->
  Object.keys(params).reduce (arr, key) ->
    arr.push params[key]
    arr
  , []

render = (options={}) ->
  document("title").html options.title
  document("#app").html React.renderComponentToString(options.component)
  document.html()

# shared routes between client & server, basically all public
# GET routes that should get indexed by search engines
sharedRoutes = require './routes'

for route, action of sharedRoutes
  ((route, action) ->
    app.get route, (req, res) ->
      action.apply(@, extractParams(req.params)).then (options) ->
        res.send render(options)
  )(route, action)

app.use express.static("#{__dirname}/public")
app.listen 4000

console.log 'liiga_frontend development server listening on port 4000'