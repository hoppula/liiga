React = require 'react/addons'

Dropdown = require './components/dropdown'
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

    console.log @props.id

    player = @props.team.roster.filter((player) =>
      [id, slug] = player.id.split("/")
      id is @props.id
    )[0]

    console.log "player", player

    <div>
      <Navigation dropdown={players} />

      <h1>{player.firstName} {player.lastName}</h1>
    </div>

module.exports = Player