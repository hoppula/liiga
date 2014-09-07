React = require 'react'
TeamItem = require './team_item'
TopScorers = require './top_scorers'

TeamsList = React.createClass

  render: ->
    <div>
      <div className="navbar navbar-default">
        <div className="navbar-header">
        <p className="navbar-brand">Liiga</p>
        </div>
      </div>
      <div className="jumbotron">
        <h1>Liiga.pw</h1>
        <p>Kaikki Liigasta nopeasti ja vaivattomasti</p>
      </div>
      <div className="row">
        <div className="teams_view col-xs-12 col-sm-6">
          {@props.teams.map (team) -> TeamItem(key: team.id, team: team)}
        </div>
        <div className="col-xs-12 col-sm-6">
          <TopScorers stats={@props.stats} />
        </div>
      </div>
    </div>

module.exports = TeamsList