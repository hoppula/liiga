require('node-cjsx').transform()
fs = require 'fs'
express = require 'express'
compress = require 'compression'
cheerio = require 'cheerio'

React = require 'react/addons'

# shared routes between client & server, basically all public
# GET routes that should get indexed by search engines
sharedRoutes = require('./routes')(require('./lib/server_ajax'))

app = express()
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

for route, action of sharedRoutes
  do (route, action) ->
    app.get route, (req, res) ->
      action.apply(@, extractParams(req.params)).then (options) ->
        res.send render(options)
      .fail (error) ->
        console.log "error", error
      .done()

app.use(compress())
app.use express.static("#{__dirname}/public")
app.listen 4000

console.log 'liiga_frontend development server listening on port 4000'