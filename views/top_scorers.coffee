React = require 'react'

TopScorers = React.createClass

  render: ->
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Nimi</th>
          <th>Ottelut</th>
          <th>Maalit</th>
          <th>Syötöt</th>
          <th>Pisteet</th>
        </tr>
      </thead>
      {@props.stats.scoringStats.map (player) ->
        <tr>
          <td>{player.firstName} {player.lastName}</td>
          <td>{player.games}</td>
          <td>{player.goals}</td>
          <td>{player.assists}</td>
          <td>{player.points}</td>
        </tr>
      }
    </table>

module.exports = TopScorers