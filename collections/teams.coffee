Backbone = require 'exoskeleton'
TeamModel = require '../models/team'

TeamsCollection = Backbone.Collection.extend
  url: "http://192.168.11.6:4000/json/teams.json"
  model: TeamModel

module.exports = TeamsCollection