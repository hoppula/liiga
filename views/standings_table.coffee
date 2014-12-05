React = require 'react/addons'

Navigation = require './navigation'
TableSortMixin = require './mixins/table_sort'
Teams = require '../lib/teams'

StandingsTable = React.createClass

  mixins: [TableSortMixin]

  getInitialState: ->
    sortField: "points"
    sortDirection: "desc"
    sortType: "integer"

  render: ->
    standings = @props.standings.sort(@sort).map (team, i) ->
      rowClass = switch
        when i is 6
          "in"
        when i is 10
          "maybe"
        else
          ""
      <tr className={rowClass} key={team.name}>
        <td>{team.position}</td>
        <td><a href="/joukkueet/#{Teams.nameToId(team.name)}">{team.name}</a></td>
        <td>{team.games}</td>
        <td>{team.wins}</td>
        <td>{team.ties}</td>
        <td>{team.loses}</td>
        <td>{team.extraPoints}</td>
        <td>{team.points}</td>
        <td className="hide-on-mobile">{team.goalsFor}</td>
        <td className="hide-on-mobile">{team.goalsAgainst}</td>
        <td className="hide-on-mobile">{team.powerplayPercentage}</td>
        <td className="hide-on-mobile">{team.shorthandPercentage}</td>
        <td className="hide-on-mobile">{team.pointsPerGame}</td>
      </tr>

    <table className="table team-schedule">
      <thead className="sortable-thead" onClick={@setSort}>
        <tr>
          <th></th>
          <th></th>
          <th data-sort="games">O</th>
          <th data-sort="wins">V</th>
          <th data-sort="ties">T</th>
          <th data-sort="loses">H</th>
          <th data-sort="extraPoints">LP</th>
          <th data-sort="points">P</th>
          <th className="hide-on-mobile" data-sort="goalsFor">TM</th>
          <th className="hide-on-mobile" data-sort="goalsAgainst">PM</th>
          <th className="hide-on-mobile" data-sort="powerplayPercentage" data-type="float">YV%</th>
          <th className="hide-on-mobile" data-sort="shorthandPercentage" data-type="float">AV%</th>
          <th className="hide-on-mobile" data-sort="pointsPerGame" data-type="float">P/O</th>
        </tr>
      </thead>
      <tbody>
        {standings}
      </tbody>
    </table>

module.exports = StandingsTable