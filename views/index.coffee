React = require 'react/addons'
Navigation = require './navigation'
TeamsListView = require './teams_list'

Index = React.createClass

  render: ->
    <div>
      <Navigation />

      <div className="jumbotron">
        <h1>Liiga.pw</h1>
        <p>Kaikki Liigasta nopeasti ja vaivattomasti</p>
      </div>

      <TeamsListView teams={@props.teams} stats={@props.stats} />
    </div>

module.exports = Index