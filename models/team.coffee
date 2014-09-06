Backbone = require 'exoskeleton'
TeamModel = Backbone.Model.extend
  url: ->
    "http://localhost:4000/json/#{@id}.json"
  parse: (response) ->
    console.log "#{@id}.json raw", response
    response
module.exports = TeamModel