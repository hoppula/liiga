React = require 'react/addons'

TeamRoster = React.createClass

  render: ->
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Nimi</th>
          <th>Numero</th>
          <th>Pituus</th>
          <th>Paino</th>
          <th>Kätisyys</th>
        </tr>
      </thead>
      {@props.roster.map (player) =>
        url = "/joukkueet/#{@props.teamId}/#{player.id}"
        title = "#{player.firstName} #{player.lastName}"
        <tr key={player.id}>
          <td><a href={url}>{title}</a></td>
          <td>{player.number}</td>
          <td>{player.height}</td>
          <td>{player.weight}</td>
          <td>{player.shoots}</td>
        </tr>
      }
    </table>

module.exports = TeamRoster