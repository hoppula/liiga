React = require 'react/addons'
TeamItem = require './team_item'
TopScorers = require './top_scorers'

TeamsList = React.createClass

  render: ->
    <div className="row">
      <div className="teams_view col-xs-12 col-sm-6">
        {@props.teams.map (team) -> TeamItem(key: team.id, team: team)}
      </div>
      <div className="col-xs-12 col-sm-6">
        <TopScorers stats={@props.stats} />
      </div>
    </div>

module.exports = TeamsList