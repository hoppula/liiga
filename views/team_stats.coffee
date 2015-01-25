React = require 'react/addons'

PlayerStats = require './player_stats'
GoalieStats = require './goalie_stats'

TeamStats = React.createClass

  render: ->
    stats = @props.stats or {}
    <div className="table-responsive">
      <PlayerStats stats={stats.players} />
      <GoalieStats stats={stats.goalies} />
    </div>

module.exports = TeamStats