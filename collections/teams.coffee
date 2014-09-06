Backbone = require 'exoskeleton'
TeamModel = require '../models/team'

TeamsCollection = Backbone.Collection.extend
  url: "http://localhost:4000/json/teams.json"
  model: TeamModel
  comparator: "name"

module.exports = TeamsCollection