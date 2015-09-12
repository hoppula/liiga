React = require 'react'
{Nav, NavItem, TabPane} = require 'react-bootstrap'

Teams = require '../../lib/teams'

PlayerStats = require '../shared/player_stats'
GoalieStats = require '../shared/goalie_stats'

GameStats = React.createClass

  render: ->
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

      <div className="tab-content" ref="panes">
        <TabPane key="home" animation={false} active={activeKey is "home"}>
          <PlayerStats teamId={homeId} stats={home.players} />
          <GoalieStats teamId={homeId} stats={home.goalies} playedAtLeast={0} />
        </TabPane>
        <TabPane key="away" animation={false} active={activeKey is "away"}>
          <PlayerStats teamId={awayId} stats={away.players} />
          <GoalieStats teamId={awayId} stats={away.goalies} playedAtLeast={0} />
        </TabPane>
      </div>
    </div>

module.exports = GameStats
