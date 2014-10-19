Model = require('cerebellum').exoskeleton.Model
apiConfig = require '../config/api'

Stats = Model.extend
  cacheKey: ->
    "stats"

  url: "#{apiConfig.url}/json/stats.json"

module.exports = Stats