Model = require('cerebellum').exoskeleton.Model
apiConfig = require '../config/api'

Team = Model.extend
  cacheKey: ->
    "teams/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/json/teams/#{@storeOptions.id}.json"

module.exports = Team