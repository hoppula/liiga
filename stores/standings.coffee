Collection = require('cerebellum/collection')
apiConfig = require '../config/api'

Standings = Collection.extend
  cacheKey: ->
    "standings"

  url: "#{apiConfig.url}/standings.json"

module.exports = Standings