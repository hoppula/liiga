TeamsCollection = require './stores/teams'
StatsModel = require './stores/stats'
TeamModel = require './stores/team'
MatchModel = require './stores/match'

module.exports =
  teams: TeamsCollection
  stats: StatsModel
  team: TeamModel
  match: MatchModel