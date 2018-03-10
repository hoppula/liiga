import Model from 'cerebellum/model'
import apiConfig from '../config/api'

export default GameEvents = Model.extend
  cacheKey: ->
    "games/events/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/games/events/#{@storeOptions.id}.json"
