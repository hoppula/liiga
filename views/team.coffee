# @cjsx React.DOM
React = require 'react'
PlayerStats = require './player_stats'

Team = React.createClass

  render: ->
    <div className="team">
      <div>{@props.team.name}</div>
      <PlayerStats stats={@props.team.playerStats} />
      <div>{@props.team.teamStats.city}</div>
    </div>

module.exports = Team