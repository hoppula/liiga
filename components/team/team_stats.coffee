React = require 'react'

PlayerStats = require '../shared/player_stats'
GoalieStats = require '../shared/goalie_stats'

TeamStats = React.createClass

  render: ->
    stats = @props.stats or {}
    <div className="table-responsive">
      <PlayerStats stats={stats.players} />
      <GoalieStats stats={stats.goalies} />
    </div>

module.exports = TeamStats