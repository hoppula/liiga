React = require 'react'
{Nav, NavItem, Tabs, Tab} = require 'react-bootstrap'

Teams = require '../../lib/teams'
Spinner = require '../shared/spinner'
PlayerStats = require '../shared/player_stats'
GoalieStats = require '../shared/goalie_stats'

GameStats = React.createClass

  render: ->
    if !Object.keys(@props.stats).length
      return (
        <div className="table-responsive">
          <Spinner />
        </div>
      )

    home = @props.stats.home or {}
    away = @props.stats.away or {}
    homeId = Teams.nameToId(home.team)
    awayId = Teams.nameToId(away.team)
    activeKey = if @props.away then "away" else "home"

    <div className="game-stats">
      <Nav bsStyle="tabs" activeKey={activeKey} ref="tabs">
        <NavItem href="/ottelut/#{@props.id}/tilastot" eventKey="home">{home.team}</NavItem>
        <NavItem href="/ottelut/#{@props.id}/tilastot/vieras" eventKey="away">{away.team}</NavItem>
      </Nav>

      <Tabs activeKey={activeKey} animation={false}>
        <Tab eventKey="home">
          <PlayerStats teamId={homeId} stats={home.players} />
          <GoalieStats teamId={homeId} stats={home.goalies} playedAtLeast={0} />
        </Tab>
        <Tab eventKey="away">
          <PlayerStats teamId={awayId} stats={away.players} />
          <GoalieStats teamId={awayId} stats={away.goalies} playedAtLeast={0} />
        </Tab>
      </Tabs>
    </div>

module.exports = GameStats
