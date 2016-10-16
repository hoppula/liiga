React = require 'react'

Teams = require '../../lib/teams'

Navigation = require '../shared/navigation'
TableSort = require './table_sort'
TableHeader = require './table_header'
HeaderColumn = require './header_column'
Row = require './row'
Column = require './column'
Spinner = require './spinner'

StandingsTable = React.createClass

  render: ->
    return <div className="table-responsive"><Spinner /></div> if !@props.standings or !@props.standings.length
    standings = (@props.standings or []).sort(@props.sort).map (team, i) =>
      rowClass = switch
        when i is 6
          "in"
        when i is 10
          "maybe"
        else
          ""
      <Row className={rowClass} key={team.name} sortField={@props.sortField}>
        <Column name="position">{team.position}</Column>
        <Column name="name" className="team-column #{Teams.nameToId(team.name)}">
          <a href="/joukkueet/#{Teams.nameToId(team.name)}">{team.name}</a>
        </Column>
        <Column name="games">{team.games}</Column>
        <Column name="wins">{team.wins}</Column>
        <Column name="ties">{team.ties}</Column>
        <Column name="loses">{team.loses}</Column>
        <Column name="extraPoints">{team.extraPoints}</Column>
        <Column name="points">{team.points}</Column>
        <Column name="goalsFor">{team.goalsFor}</Column>
        <Column name="goalsAgainst">{team.goalsAgainst}</Column>
        <Column name="powerplayPercentage">{team.powerplayPercentage}</Column>
        <Column name="shorthandPercentage">{team.shorthandPercentage}</Column>
        <Column name="pointsPerGame">{team.pointsPerGame}</Column>
      </Row>

    <table className="table team-schedule">
      <TableHeader
        onClick={(column, type) => @props.setSort(column, type)}
        sortField={@props.sortField}
        sortDirection={@props.sortDirection}>
          <HeaderColumn sort="position"></HeaderColumn>
          <HeaderColumn sort="name" type="string"></HeaderColumn>
          <HeaderColumn sort="games">O</HeaderColumn>
          <HeaderColumn sort="wins">V</HeaderColumn>
          <HeaderColumn sort="ties">T</HeaderColumn>
          <HeaderColumn sort="loses">H</HeaderColumn>
          <HeaderColumn sort="extraPoints">LP</HeaderColumn>
          <HeaderColumn sort="points">P</HeaderColumn>
          <HeaderColumn sort="goalsFor">TM</HeaderColumn>
          <HeaderColumn sort="goalsAgainst">PM</HeaderColumn>
          <HeaderColumn sort="powerplayPercentage" type="float">YV%</HeaderColumn>
          <HeaderColumn sort="shorthandPercentage" type="float">AV%</HeaderColumn>
          <HeaderColumn sort="pointsPerGame" type="float">P/O</HeaderColumn>
      </TableHeader>
      <tbody>
        {standings}
      </tbody>
    </table>

module.exports = TableSort(
  sortField: "points"
  sortDirection: "desc"
  sortType: "integer"
)(StandingsTable)
