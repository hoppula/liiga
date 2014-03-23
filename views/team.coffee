React = require 'react'
{div} = React.DOM

Team = React.createClass

  render: ->
    div
      className: "team #{@props.team.get('id')}"
    , @props.team.get('name')

module.exports = Team