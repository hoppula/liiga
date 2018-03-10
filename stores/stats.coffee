import Model from 'cerebellum/model'
import apiConfig from '../config/api'

export default Stats = Model.extend
  cacheKey: ->
    "stats"

  url: "#{apiConfig.url}/stats.json"
