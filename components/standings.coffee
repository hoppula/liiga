React = require 'react'

Navigation = require './shared/navigation'
StandingsTable = require './shared/standings_table'

Standings = React.createClass

  statics:
    title: "Sarjataulukko"
    stores: (request) ->
      standings: {}

  componentDidMount: ->
    window.scrollTo(0,0)

  render: ->
    <div>
      <Navigation />

      <h1>Sarjataulukko</h1>

      <div className="standings table-responsive table-full">
        <StandingsTable standings={@props.standings} />
      </div>
    </div>

module.exports = Standings
