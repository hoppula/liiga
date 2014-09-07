React = require 'react'

TopScorers = React.createClass

  render: ->
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Games</th>
          <th>Goals</th>
          <th></th>
        </tr>
      </thead>
      {@props.stats.scoringStats.map (player) ->
        <tr>
          <td>{player.firstName} {player.lastName}</td>
          <td>{player.games}</td>
          <td>{player.goals}</td>
          <td></td>
        </tr>
      }
    </table>

module.exports = TopScorers