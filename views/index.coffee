React = require 'react/addons'
Navigation = require './navigation'
TeamsListView = require './teams_list'
TopScorersView = require './top_scorers'

Index = React.createClass

  componentDidMount: ->
    window.scrollTo(0,0)

  render: ->
    <div>
      <Navigation />

      <div className="jumbotron">
        <h1>Liiga.pw</h1>
        <p>Liigan tilastot nopeasti ja vaivattomasti</p>
      </div>

      <TeamsListView teams={@props.teams} />

      <TopScorersView stats={@props.stats} />

    </div>

module.exports = Index