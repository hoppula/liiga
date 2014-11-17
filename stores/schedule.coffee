Collection = require('cerebellum').Collection
apiConfig = require '../config/api'

Schedule = Collection.extend
  cacheKey: ->
    "schedule"

  url: "#{apiConfig.url}/schedule.json"

module.exports = Schedule