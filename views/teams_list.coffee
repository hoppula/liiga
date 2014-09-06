# @cjsx React.DOM
React = require 'react'
TeamItem = require './team_item'

TeamsList = React.createClass

  render: ->
    <div>
      <h1>Liiga</h1>
      <div className="teams_view">
        {@props.teams.map (team) -> TeamItem(key: team.id, team: team)}
      </div>
    </div>

module.exports = TeamsList