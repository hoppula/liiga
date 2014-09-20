React = require 'react/addons'

Navigation = require './navigation'

Player = React.createClass

  render: ->
    teamId = @props.teamId
    roster = @props.team.roster

    players =
      title: "Pelaajat",
      items: roster.map (player) =>
        title: "#{player.firstName} #{player.lastName}"
        url: "/joukkueet/#{teamId}/#{player.id}"

    player = @props.team.roster.filter((player) =>
      [id, slug] = player.id.split("/")
      id is @props.id
    )[0]

    console.log "player", player

    <div>
      <Navigation dropdown={players} team={@props.team} />

      <h1>{player.firstName} {player.lastName}</h1>
    </div>

module.exports = Player