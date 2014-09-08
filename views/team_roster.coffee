React = require 'react'

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
      {@props.roster.map (player) ->
        <tr>
          <td>{player.firstName} {player.lastName}</td>
          <td>{player.number}</td>
          <td>{player.height}</td>
          <td>{player.weight}</td>
          <td>{player.shoots}</td>
        </tr>
      }
    </table>

module.exports = TeamRoster