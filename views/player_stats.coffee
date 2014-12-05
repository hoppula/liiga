React = require 'react/addons'

TableSortMixin = require './mixins/table_sort'

PlayerStats = React.createClass

  mixins: [TableSortMixin]

  getInitialState: ->
    sortField: "points"
    sortDirection: "desc"
    sortType: "integer"

  render: ->
    limit = if @props.limit then @props.limit else @props.stats.length
    players = @props.stats.sort(@sort).slice(0, limit).map (player) =>
      teamId = @props.teamId or player.teamId
      <tr key={player.id}>
        <td><a href="/joukkueet/#{teamId}/#{player.id}">{player.firstName} {player.lastName}</a></td>
        <td>{player.games}</td>
        <td>{player.goals}</td>
        <td>{player.assists}</td>
        <td>{player.points}</td>
        <td>{player.penalties}</td>
        <td>{player.plusMinus}</td>
        <td>{player.plusses}</td>
        <td>{player.minuses}</td>
        <td>{player.powerPlayGoals}</td>
        <td>{player.shortHandedGoals}</td>
        <td>{player.winningGoals}</td>
        <td>{player.shots}</td>
        <td>{player.shootingPercentage}</td>
        <td>{player.faceoffs}</td>
        <td>{player.faceoffPercentage}</td>
        <td>{player.playingTimeAverage}</td>
      </tr>

    <table className="table table-striped team-roster">
      <thead className="sortable-thead" onClick={@setSort}>
        <tr>
          <th data-sort="lastName" data-type="string">Nimi</th>
          <th data-sort="games" data-type="integer">O</th>
          <th data-sort="goals" data-type="integer">M</th>
          <th data-sort="assists" data-type="integer">S</th>
          <th data-sort="points" data-type="integer">P</th>
          <th data-sort="penalties" data-type="integer">R</th>
          <th data-sort="plusMinus" data-type="integer">+/-</th>
          <th data-sort="plusses" data-type="integer">+</th>
          <th data-sort="minuses" data-type="integer">-</th>
          <th data-sort="powerPlayGoals" data-type="integer">YVM</th>
          <th data-sort="shortHandedGoals" data-type="integer">AVM</th>
          <th data-sort="winningGoals" data-type="integer">VM</th>
          <th data-sort="shots" data-type="integer">L</th>
          <th data-sort="shootingPercentage" data-type="float">L%</th>
          <th data-sort="faceoffs" data-type="integer">A</th>
          <th data-sort="faceoffPercentage" data-type="float">A%</th>
          <th data-sort="playingTimeAverage" data-type="float">Aika</th>
        </tr>
      </thead>
      <tbody>
        {players}
      </tbody>
    </table>

module.exports = PlayerStats