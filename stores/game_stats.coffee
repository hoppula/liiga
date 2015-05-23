Model = require('cerebellum/model')
apiConfig = require '../config/api'

GameStats = Model.extend
  cacheKey: ->
    "games/stats/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/games/stats/#{@storeOptions.id}.json"

module.exports = GameStats