React = require 'react/addons'

Navigation = require './navigation'
TableSortMixin = require './mixins/table_sort'
Teams = require '../lib/teams'

Standings = React.createClass

  mixins: [TableSortMixin]

  getInitialState: ->
    sortField: "points"
    sortDirection: "desc"
    sortType: "integer"

  componentDidMount: ->
    window.scrollTo(0,0)

  render: ->
    standings = @props.standings.sort(@sort).map (team) ->
      <tr key={team.name}>
        <td>{team.position}</td>
        <td><a href="/joukkueet/#{Teams.nameToId(team.name)}">{team.name}</a></td>
        <td>{team.games}</td>
        <td>{team.wins}</td>
        <td>{team.ties}</td>
        <td>{team.loses}</td>
        <td>{team.extraPoints}</td>
        <td>{team.points}</td>
        <td>{team.goalsFor}</td>
        <td>{team.goalsAgainst}</td>
        <td>{team.powerplayPercentage}</td>
        <td>{team.shorthandPercentage}</td>
        <td>{team.pointsPerGame}</td>
      </tr>

    <div>
      <Navigation />

      <h1>Sarjataulukko</h1>

      <div className="table-responsive">
        <table className="table table-striped team-schedule">
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
              <th data-sort="goalsFor">TM</th>
              <th data-sort="goalsAgainst">PM</th>
              <th data-sort="powerplayPercentage" data-type="float">YV%</th>
              <th data-sort="shorthandPercentage" data-type="float">AV%</th>
              <th data-sort="pointsPerGame" data-type="float">P/O</th>
            </tr>
          </thead>
          <tbody>
            {standings}
          </tbody>
        </table>
      </div>
    </div>

module.exports = Standings