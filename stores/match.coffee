Model = require('cerebellum').exoskeleton.Model
apiConfig = require '../config/api'

Match = Model.extend
  cacheKey: ->
    "matches/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/json/matches/#{@storeOptions.id}.json"

module.exports = Match