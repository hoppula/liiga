React = require 'react/addons'

PlayerStats = require './player_stats'
GoalieStats = require './goalie_stats'

TeamStats = React.createClass

  render: ->
    <div className="table-responsive">
      <PlayerStats stats={@props.stats.players} />
      <GoalieStats stats={@props.stats.goalies} />
    </div>

module.exports = TeamStats