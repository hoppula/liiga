React = require 'react/addons'

TableSortMixin = require './mixins/table_sort'

GoalieStats = React.createClass

  mixins: [TableSortMixin]

  getInitialState: ->
    sortField: "savingPercentage"
    sortDirection: "desc"
    sortType: "float"

  render: ->
    goalies = @props.stats.sort(@sort).map (player) =>
      <tr key={player.id}>
        <td><a href="/joukkueet/#{@props.teamId}/#{player.id}">{player.firstName} {player.lastName}</a></td>
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

    <table className="table table-striped team-roster">
      <thead className="sortable-thead" onClick={@setSort}>
        <tr>
          <th colSpan=17>Maalivahdit</th>
        </tr>
        <tr>
          <th data-sort="lastName" data-type="string">Nimi</th>
          <th data-sort="games">PO</th>
          <th data-sort="wins">V</th>
          <th data-sort="ties">T</th>
          <th data-sort="losses">H</th>
          <th data-sort="saves">TO</th>
          <th data-sort="goalsAllowed">PM</th>
          <th data-sort="shutouts">NP</th>
          <th data-sort="goalsAverage" data-type="float">KA</th>
          <th data-sort="savingPercentage" data-type="float">T%</th>
          <th data-sort="goals">M</th>
          <th data-sort="assists">S</th>
          <th data-sort="points">P</th>
          <th data-sort="penalties">R</th>
          <th data-sort="winPercentage" data-type="float">V%</th>
          <th data-sort="minutes" data-type="float" colSpan=2>Aika</th>
        </tr>
      </thead>
      <tbody>
        {goalies}
      </tbody>
    </table>

module.exports = GoalieStats