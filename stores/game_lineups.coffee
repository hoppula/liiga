import Model from 'cerebellum/model'
import apiConfig from '../config/api'

export default GameLineups = Model.extend
  cacheKey: ->
    "games/lineups/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/games/lineups/#{@storeOptions.id}.json"
