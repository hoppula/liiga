stores = require './stores'
routes = require './routes'

module.exports =
  staticFiles: __dirname+"/public"
  storeId: "store_state_from_server"
  appId: "app"
  routes: routes
  stores: stores