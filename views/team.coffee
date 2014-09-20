React = require 'react/addons'
PlayerStats = require './player_stats'
TeamSchedule = require './team_schedule'
TeamRoster = require './team_roster'
Dropdown = require './components/dropdown'
Navigation = require './navigation'

Team = React.createClass

  render: ->
    teams =
      title: "Joukkueet",
      items: @props.teams.map (team) ->
        title: team.name
        url: team.url

    <div>
      <Navigation dropdown={teams} />

      <div className="team">
        <h1>{@props.team.info.name}</h1>
        <div className="team-container">
          <ul>
            <li>{@props.team.info.longName}</li>
            <li>{@props.team.info.address}</li>
            <li>{@props.team.info.email}</li>
          </ul>
          <a href={@props.team.info.ticketsUrl}>Liput</a>
          <a href={@props.team.info.locationUrl}>Hallin sijainti</a>
        </div>

        <h1>Ottelut</h1>
        <TeamSchedule schedule={@props.team.schedule} />

        <h1>Pelaajat</h1>
        <TeamRoster teamId={@props.id} roster={@props.team.roster} />
      </div>
    </div>

module.exports = Team