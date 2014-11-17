React = require 'react/addons'

PlayerStats = React.createClass

  render: ->
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Games</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Points</th>
            <th>Penalties</th>
            <th>+/-</th>
          </tr>
        </thead>
        {@props.stats.map (player) ->
          <tr key={player.id}>
            <td><a href="/joukkueet/#{player.teamId}/#{player.id}">{player.firstName} >{player.lastName}</a></td>
            <td>{player.games}</td>
            <td>{player.goals}</td>
            <td>{player.assists}</td>
            <td>{player.points}</td>
            <td>{player.penalties}</td>
            <td>{player.plusMinus}</td>
          </tr>
        }
      </table>
    </div>

module.exports = PlayerStats