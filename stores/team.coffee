import Model from 'cerebellum/model'
import apiConfig from '../config/api'


export default Team = Model.extend
  cacheKey: ->
    "teams/#{@storeOptions.id}"

  url: ->
    "#{apiConfig.url}/teams/#{@storeOptions.id}.json"
