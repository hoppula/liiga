React = require 'react/addons'
{Nav, NavItem, TabPane} = require 'react-bootstrap'

Teams = require '../lib/teams'
PlayerStats = require './player_stats'
GoalieStats = require './goalie_stats'

GameStats = React.createClass

  render: ->
    homeId = Teams.nameToId(@props.stats.home.team)
    awayId = Teams.nameToId(@props.stats.away.team)
    activeKey = if @props.away then "away" else "home"

    <div className="game-stats">
      <Nav bsStyle="tabs" activeKey={activeKey} ref="tabs">
        <NavItem href="/ottelut/#{@props.id}/tilastot" eventKey="home">{@props.stats.home.team}</NavItem>
        <NavItem href="/ottelut/#{@props.id}/tilastot/vieras" eventKey="away">{@props.stats.away.team}</NavItem>
      </Nav>

      <div className="tab-content" ref="panes">
        <TabPane key="home" animation={false} active={activeKey is "home"}>
          <PlayerStats teamId={homeId} stats={@props.stats.home.players} />
          <GoalieStats teamId={homeId} stats={@props.stats.home.goalies} playedAtLeast={0} />
        </TabPane>
        <TabPane key="away" animation={false} active={activeKey is "away"}>
          <PlayerStats teamId={awayId} stats={@props.stats.away.players} />
          <GoalieStats teamId={awayId} stats={@props.stats.away.goalies} playedAtLeast={0} />
        </TabPane>
      </div>
    </div>

module.exports = GameStats