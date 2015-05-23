Model = require('cerebellum/model')
apiConfig = require '../config/api'

Team = Model.extend
  cacheKey: ->
    "teams/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/teams/#{@storeOptions.id}.json"

module.exports = Team