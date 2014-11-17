Model = require('cerebellum').Model
apiConfig = require '../config/api'

Stats = Model.extend
  cacheKey: ->
    "stats"

  url: "#{apiConfig.url}/stats.json"

module.exports = Stats