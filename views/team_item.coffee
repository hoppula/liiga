# @cjsx React.DOM
React = require 'react'
#navigateMixin = require './mixins/navigate'

TeamItem = React.createClass
#  mixins: [navigateMixin]

  render: ->
    <a className="team #{@props.team.id}" href="/joukkueet/#{@props.team.id}">
      {@props.team.name}
    </a>

module.exports = TeamItem