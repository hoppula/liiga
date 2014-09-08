React = require 'react'
PlayerStats = require './player_stats'
TeamSchedule = require './team_schedule'
TeamRoster = require './team_roster'

Team = React.createClass

  render: ->
    console.log "team", @props.team
    <div className="team">
      <div>{@props.team.info.name}</div>
      <h1>Ottelut</h1>
      <TeamSchedule schedule={@props.team.schedule} />
      <h1>Pelaajat</h1>
      <TeamRoster roster={@props.team.roster} />
    </div>

module.exports = Team