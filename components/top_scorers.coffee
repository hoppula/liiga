import React from 'react'

export default TopScorers = React.createClass
  render: ->
    <div className="table-responsive">
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
        {@props.stats.scoringStats.filter (player, index) ->
          index < 20
        .map (player) ->
          <tr key={player.id}>
            <td><a href="/joukkueet/#{player.teamId}/#{player.id}">{player.firstName} {player.lastName}</a></td>
            <td>{player.games}</td>
            <td>{player.goals}</td>
            <td>{player.assists}</td>
            <td>{player.points}</td>
          </tr>
        }
      </table>
    </div>
