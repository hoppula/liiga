React = require 'react'
_ = require 'lodash'

TableSortMixin = require '../mixins/table_sort'

GoalieStats = React.createClass

  mixins: [TableSortMixin]

  getInitialState: ->
    sortField: "savingPercentage"
    sortDirection: "desc"
    sortType: "float"

  render: ->
    stats = @props.stats or []
    maxGames = _.max(stats, (player) ->
      parseInt(player.games)
    ).games
    playedAtLeast = if typeof @props.playedAtLeast is "number"
      parseInt((@props.playedAtLeast / 100) * maxGames)
    else
      1
    goalies = stats.sort(@sort).filter (player) ->
      if player.games
        player.games >= playedAtLeast
      else
        true
    .map (player) =>
      teamId = @props.teamId or player.teamId
      <tr key={player.id}>
        <td><a href="/joukkueet/#{teamId}/#{player.id}">{player.firstName} {player.lastName}</a></td>
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
          <th data-sort="lastName" data-type="string">Nimi</th>
          <th data-sort="games" data-type="integer">PO</th>
          <th data-sort="wins" data-type="integer">V</th>
          <th data-sort="ties" data-type="integer">T</th>
          <th data-sort="losses" data-type="integer">H</th>
          <th data-sort="saves" data-type="integer">TO</th>
          <th data-sort="goalsAllowed" data-type="integer">PM</th>
          <th data-sort="shutouts" data-type="integer">NP</th>
          <th data-sort="goalsAverage" data-type="float">KA</th>
          <th data-sort="savingPercentage" data-type="float">T%</th>
          <th data-sort="goals" data-type="integer">M</th>
          <th data-sort="assists" data-type="integer">S</th>
          <th data-sort="points" data-type="integer">P</th>
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