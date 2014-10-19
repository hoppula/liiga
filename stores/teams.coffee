Collection = require('cerebellum').exoskeleton.Collection
apiConfig = require '../config/api'

Teams = Collection.extend
  cacheKey: ->
    "teams"

  url: "#{apiConfig.url}/json/teams.json"

module.exports = Teams