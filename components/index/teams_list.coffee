React = require 'react'

Teams = require '../../lib/teams'

TeamsList = React.createClass

  render: ->
    <div className="row">
      <div className="teams-view col-xs-12 col-sm-12 col-md-12 col-lg-12">
        {
          @props.teams
          .filter (team) ->
            Teams.idToName(team.id)
          .map (team) ->
            <a key={team.id} className="team-logo #{team.id}" href="/joukkueet/#{team.id}"></a>
        }
      </div>
    </div>

module.exports = TeamsList
