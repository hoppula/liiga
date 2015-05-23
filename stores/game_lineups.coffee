Model = require('cerebellum/model')
apiConfig = require '../config/api'

GameLineups = Model.extend
  cacheKey: ->
    "games/lineups/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/games/lineups/#{@storeOptions.id}.json"

module.exports = GameLineups