React = require 'react'
{Tabs, Tab, Nav, NavItem} = require "react-bootstrap"

Navigation = require './shared/navigation'
PlayerStats = require './shared/player_stats'
GoalieStats = require './shared/goalie_stats'

Stats = React.createClass

  statics:
    title: "Tilastot"
    stores: (request) ->
      stats: {}
    preprocess: (props, request) ->
      props.active = request.params.active
      props

  componentDidMount: ->
    window.scrollTo(0,0)

  render: ->
    activeKey = switch @props.active
      when "maalivahdit" then "goalies"
      else "players"

    <div>
      <Navigation />

      <h1>Tilastot</h1>

      <div>
        <Nav bsStyle="tabs" activeKey={activeKey} ref="tabs">
          <NavItem href="/tilastot" eventKey="players">Kenttäpelaajat</NavItem>
          <NavItem href="/tilastot/maalivahdit" eventKey="goalies">Maalivahdit</NavItem>
        </Nav>
        <Tabs activeKey={activeKey} animation={false}>
          <Tab eventKey="players">
            <h2>Kenttäpelaajat</h2>
            <div className="table-responsive">
              <PlayerStats stats={@props.stats.scoringStats} limit={100} />
            </div>
          </Tab>
          <Tab eventKey="goalies">
            <h2>Maalivahdit (yli 25% pelanneet)</h2>
            <div className="table-responsive">
              <GoalieStats stats={@props.stats.goalieStats} playedAtLeast={25} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>

module.exports = Stats
