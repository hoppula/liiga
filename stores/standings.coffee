import Collection from 'cerebellum/collection'
import apiConfig from '../config/api'

export default Standings = Collection.extend
  cacheKey: ->
    "standings"

  url: "#{apiConfig.url}/standings.json"
