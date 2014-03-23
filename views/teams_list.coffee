React = require 'react'
TeamItem = require './team_item'
{div} = React.DOM

TeamsList = React.createClass

  render: ->
    div className: "teams_view",
      @props.teams.map (team) ->
        TeamItem(key: team.get('id'), team: team)

module.exports = TeamsList