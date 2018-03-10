import Model from 'cerebellum/model'
import apiConfig from '../config/api'

export default GameStats = Model.extend
  cacheKey: ->
    "games/stats/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/games/stats/#{@storeOptions.id}.json"
