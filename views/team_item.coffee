React = require 'react'

TeamItem = React.createClass

  render: ->
    <a className="team #{@props.team.id} btn btn-default btn-lg btn-block" href="/joukkueet/#{@props.team.id}">
      {@props.team.name}
    </a>

module.exports = TeamItem