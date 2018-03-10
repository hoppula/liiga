import Collection from 'cerebellum/collection'
import apiConfig from '../config/api'

export default Schedule = Collection.extend
  cacheKey: ->
    "schedule"

  url: "#{apiConfig.url}/schedule.json"
