React = require 'react/addons'
_ = require 'lodash'

TableSortMixin = require './mixins/table_sort'

TeamStats = React.createClass

  mixins: [TableSortMixin]

  getInitialState: ->
    sortField: "points"
    sortDirection: "desc"
    sortType: "integer"

  render: ->
    players = @props.stats.players.sort(@sort).map (player) =>
      <tr key={player.id}>
        <td><a href="/joukkueet/#{@props.teamId}/#{player.id}">{player.firstName} {player.lastName}</a></td>
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

    goalies = @props.stats.goalies.map (player) =>
      <tr key={player.id}>
        <td>{player.firstName} {player.lastName}</td>
        <td>{player.games}</td>
        <td>{player.wins}</td>
        <td>{player.ties}</td>
        <td>{player.losses}</td>
        <td>{player.saves}</td>
        <td>{player.goalsAllowed}</td>
        <td>{player.shutouts}</td>
        <td>{player.goalsAverage}</td>
        <td>{player.savingPercentage}</td>
        <td>{player.goals}</td>
        <td>{player.assists}</td>
        <td>{player.points}</td>
        <td>{player.penalties}</td>
        <td>{player.winPercentage}</td>
        <td colSpan=2>{player.minutes}</td>
      </tr>

    <div className="table-responsive">
      <table className="table table-striped team-roster">
        <thead className="sortable-thead" onClick={@setSort}>
          <tr>
            <th colSpan=17>Pelaajat</th>
          </tr>
          <tr>
            <th data-sort="lastName" data-type="string">Nimi</th>
            <th data-sort="games">O</th>
            <th data-sort="goals">M</th>
            <th data-sort="assists">S</th>
            <th data-sort="points">P</th>
            <th data-sort="penalties">R</th>
            <th data-sort="plusMinus">+/-</th>
            <th data-sort="plusses">+</th>
            <th data-sort="minuses">-</th>
            <th data-sort="powerPlayGoals">YVM</th>
            <th data-sort="shortHandedGoals">AVM</th>
            <th data-sort="winningGoals">VM</th>
            <th data-sort="shots">L</th>
            <th data-sort="shootingPercentage" data-type="float">L%</th>
            <th data-sort="faceoffs">A</th>
            <th data-sort="faceoffPercentage" data-type="float">A%</th>
            <th data-sort="playingTimeAverage" data-type="float">Aika</th>
          </tr>
        </thead>
        <tbody>
          {players}
        </tbody>
        <thead>
          <tr>
            <th colSpan=17>Maalivahdit</th>
          </tr>
          <tr>
            <th>Nimi</th>
            <th>PO</th>
            <th>V</th>
            <th>T</th>
            <th>H</th>
            <th>TO</th>
            <th>PM</th>
            <th>NP</th>
            <th>KA</th>
            <th>T%</th>
            <th>M</th>
            <th>S</th>
            <th>P</th>
            <th>R</th>
            <th>V%</th>
            <th colSpan=2>Aika</th>
          </tr>
        </thead>
        <tbody>
          {goalies}
        </tbody>
      </table>
    </div>

module.exports = TeamStats