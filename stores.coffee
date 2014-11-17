TeamsCollection = require './stores/teams'
ScheduleCollection = require './stores/schedule'
StandingsCollection = require './stores/standings'
StatsModel = require './stores/stats'
TeamModel = require './stores/team'
GameEventsModel = require './stores/game_events'
GameLineupsModel = require './stores/game_lineups'
GameStatsModel = require './stores/game_stats'

module.exports =
  teams: TeamsCollection
  schedule: ScheduleCollection
  standings: StandingsCollection
  stats: StatsModel
  team: TeamModel
  gameEvents: GameEventsModel
  gameLineups: GameLineupsModel
  gameStats: GameStatsModel