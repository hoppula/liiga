Model = require('cerebellum').Model
apiConfig = require '../config/api'

GameEvents = Model.extend
  cacheKey: ->
    "games/events/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/games/events/#{@storeOptions.id}.json"

module.exports = GameEvents