import React from 'react'
import _ from 'lodash'

import TableSort from './table_sort'
import TableHeader from './table_header'
import HeaderColumn from './header_column'
import Row from './row'
import Column from './column'
import Spinner from './spinner'

GoalieStats = React.createClass
  render: ->
    stats = @props.stats or []
    return <Spinner /> if !stats.length
    maxGames = _.max(stats, (player) ->
      parseInt(player.games)
    ).games
    playedAtLeast = if typeof @props.playedAtLeast is "number"
      parseInt((@props.playedAtLeast / 100) * maxGames)
    else
      1
    goalies = stats.sort(@props.sort).filter (player) ->
      if player.games
        player.games >= playedAtLeast
      else
        true
    .map (player) =>
      teamId = @props.teamId or player.teamId
      <Row key={player.id} sortField={@props.sortField}>
        <Column name="lastName"><a href="/joukkueet/#{teamId}/#{player.id}">{player.firstName} {player.lastName}</a></Column>
        <Column name="games">{player.games}</Column>
        <Column name="wins">{player.wins}</Column>
        <Column name="ties">{player.ties}</Column>
        <Column name="losses">{player.losses}</Column>
        <Column name="saves">{player.saves}</Column>
        <Column name="goalsAllowed">{player.goalsAllowed}</Column>
        <Column name="shutouts">{player.shutouts}</Column>
        <Column name="goalsAverage">{player.goalsAverage}</Column>
        <Column name="savingPercentage">{player.savingPercentage}</Column>
        <Column name="goals">{player.goals}</Column>
        <Column name="assists">{player.assists}</Column>
        <Column name="points">{player.points}</Column>
        <Column name="penalties">{player.penalties}</Column>
        <Column name="winPercentage">{player.winPercentage}</Column>
        <Column name="minutes" colSpan={2}>{player.minutes}</Column>
      </Row>

    <table className="table table-striped team-roster">
      <TableHeader
        onClick={(column, type) => @props.setSort(column, type)}
        sortField={@props.sortField}
        sortDirection={@props.sortDirection}>
        <HeaderColumn sort="lastName" type="string">Nimi</HeaderColumn>
        <HeaderColumn sort="games" type="integer">PO</HeaderColumn>
        <HeaderColumn sort="wins" type="integer">V</HeaderColumn>
        <HeaderColumn sort="ties" type="integer">T</HeaderColumn>
        <HeaderColumn sort="losses" type="integer">H</HeaderColumn>
        <HeaderColumn sort="saves" type="integer">TO</HeaderColumn>
        <HeaderColumn sort="goalsAllowed" type="integer">PM</HeaderColumn>
        <HeaderColumn sort="shutouts" type="integer">NP</HeaderColumn>
        <HeaderColumn sort="goalsAverage" type="float">KA</HeaderColumn>
        <HeaderColumn sort="savingPercentage" type="float">T%</HeaderColumn>
        <HeaderColumn sort="goals" type="integer">M</HeaderColumn>
        <HeaderColumn sort="assists" type="integer">S</HeaderColumn>
        <HeaderColumn sort="points" type="integer">P</HeaderColumn>
        <HeaderColumn sort="penalties">R</HeaderColumn>
        <HeaderColumn sort="winPercentage" type="float">V%</HeaderColumn>
        <HeaderColumn sort="minutes" type="float" colSpan={2}>Aika</HeaderColumn>
      </TableHeader>
      <tbody>
        {goalies}
      </tbody>
    </table>

export default TableSort(
  sortField: "savingPercentage"
  sortDirection: "desc"
  sortType: "float"
)(GoalieStats)
