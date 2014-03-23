React = require 'react'
navigateMixin = require './mixins/navigate'
{div} = React.DOM

TeamItem = React.createClass
  mixins: [navigateMixin]

  url: ->
    "/joukkueet/#{@props.team.get('id')}"

  render: ->
    div
      className: "team #{@props.team.get('id')}"
      onClick: @navigate
    , @props.team.get('name')

module.exports = TeamItem