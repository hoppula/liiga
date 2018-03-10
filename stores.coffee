import TeamsCollection from './stores/teams'
import ScheduleCollection from './stores/schedule'
import StandingsCollection from './stores/standings'
import StatsModel from './stores/stats'
import TeamModel from './stores/team'
import GameEventsModel from './stores/game_events'
import GameLineupsModel from './stores/game_lineups'
import GameStatsModel from './stores/game_stats'

export default
  teams: TeamsCollection
  schedule: ScheduleCollection
  standings: StandingsCollection
  stats: StatsModel
  team: TeamModel
  gameEvents: GameEventsModel
  gameLineups: GameLineupsModel
  gameStats: GameStatsModel