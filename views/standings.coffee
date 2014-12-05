React = require 'react/addons'

Navigation = require './navigation'
StandingsTable = require './standings_table'

Standings = React.createClass

  componentDidMount: ->
    window.scrollTo(0,0)

  render: ->
    <div>
      <Navigation />

      <h1>Sarjataulukko</h1>

      <div className="standings table-responsive">
        <StandingsTable standings={@props.standings} />
      </div>
    </div>

module.exports = Standings