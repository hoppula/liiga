import Collection from 'cerebellum/collection'
import apiConfig from '../config/api'

export default Teams = Collection.extend
  cacheKey: ->
    "teams"

  url: "#{apiConfig.url}/teams.json"
