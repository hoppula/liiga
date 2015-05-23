Collection = require('cerebellum/collection')
apiConfig = require '../config/api'

Teams = Collection.extend
  cacheKey: ->
    "teams"

  url: "#{apiConfig.url}/teams.json"

module.exports = Teams