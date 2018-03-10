import React from 'react'

import TableSort from './table_sort'
import TableHeader from './table_header'
import HeaderColumn from './header_column'
import Row from './row'
import Column from './column'
import Spinner from './spinner'

PlayerStats = React.createClass
  render: ->
    stats = @props.stats or []
    return <Spinner /> if !stats.length
    limit = if @props.limit then @props.limit else stats.length
    players = stats.sort(@props.sort).slice(0, limit).map (player) =>
      teamId = @props.teamId or player.teamId
      <Row key={player.id} sortField={@props.sortField}>
        <Column name="lastName">
          <a href="/joukkueet/#{teamId}/#{player.id}">
            {player.firstName} {player.lastName}
          </a>
        </Column>
        <Column name="position">{player.position}</Column>
        <Column name="games">{player.games}</Column>
        <Column name="goals">{player.goals}</Column>
        <Column name="assists">{player.assists}</Column>
        <Column name="points">{player.points}</Column>
        <Column name="penalties">{player.penalties}</Column>
        <Column name="plusMinus">{player.plusMinus}</Column>
        <Column name="plusses">{player.plusses}</Column>
        <Column name="minuses">{player.minuses}</Column>
        <Column name="powerPlayGoals">{player.powerPlayGoals}</Column>
        <Column name="shortHandedGoals">{player.shortHandedGoals}</Column>
        <Column name="winningGoals">{player.winningGoals}</Column>
        <Column name="shots">{player.shots}</Column>
        <Column name="shootingPercentage">{player.shootingPercentage}</Column>
        <Column name="faceoffs">{player.faceoffs}</Column>
        <Column name="faceoffPercentage">{player.faceoffPercentage}</Column>
        <Column name="playingTimeAverage">{player.playingTimeAverage}</Column>
      </Row>

    <table className="table table-striped team-roster">
      <TableHeader
        onClick={(column, type) => @props.setSort(column, type)}
        sortField={@props.sortField}
        sortDirection={@props.sortDirection}
      >
        <HeaderColumn className="lastName" sort="lastName" type="string">Nimi</HeaderColumn>
        <HeaderColumn sort="position" type="string">PP</HeaderColumn>
        <HeaderColumn sort="games" type="integer">O</HeaderColumn>
        <HeaderColumn sort="goals" type="integer">M</HeaderColumn>
        <HeaderColumn sort="assists" type="integer">S</HeaderColumn>
        <HeaderColumn sort="points" type="integer">P</HeaderColumn>
        <HeaderColumn sort="penalties" type="integer">R</HeaderColumn>
        <HeaderColumn sort="plusMinus" type="integer">+/-</HeaderColumn>
        <HeaderColumn sort="plusses" type="integer">+</HeaderColumn>
        <HeaderColumn sort="minuses" type="integer">-</HeaderColumn>
        <HeaderColumn sort="powerPlayGoals" type="integer">YVM</HeaderColumn>
        <HeaderColumn sort="shortHandedGoals" type="integer">AVM</HeaderColumn>
        <HeaderColumn sort="winningGoals" type="integer">VM</HeaderColumn>
        <HeaderColumn sort="shots" type="integer">L</HeaderColumn>
        <HeaderColumn sort="shootingPercentage" type="float">L%</HeaderColumn>
        <HeaderColumn sort="faceoffs" type="integer">A</HeaderColumn>
        <HeaderColumn sort="faceoffPercentage" type="float">A%</HeaderColumn>
        <HeaderColumn sort="playingTimeAverage" type="float">Aika</HeaderColumn>
      </TableHeader>
      <tbody>
        {players}
      </tbody>
    </table>

export default TableSort(
  sortField: "points"
  sortDirection: "desc"
  sortType: "integer"
)(PlayerStats)
