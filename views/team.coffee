React = require 'react'
PlayerStats = require './player_stats'
TeamSchedule = require './team_schedule'

Team = React.createClass

  render: ->
    <div className="team">
      <div>{@props.team.name}</div>
      <h1>Pelaajatilastot</h1>
      <PlayerStats stats={@props.team.playerStats} />
      <h1>Ottelut</h1>
      <TeamSchedule schedule={@props.team.schedule} />

      <div>{@props.team.teamStats.city}</div>
    </div>

module.exports = Team