React = require 'react/addons'
{TabPane, Nav, NavItem} = require "react-bootstrap"
Navigation = require './navigation'

PlayerStats = require './player_stats'
GoalieStats = require './goalie_stats'

Stats = React.createClass

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
        <div className="tab-content" ref="panes">
          <TabPane key="players" animation={false} active={activeKey is "players"}>
            <h2>Kenttäpelaajat</h2>
            <PlayerStats stats={@props.stats.scoringStats} />
          </TabPane>
          <TabPane key="goalies" animation={false} active={activeKey is "goalies"}>
            <h2>Maalivahdit</h2>
            <GoalieStats stats={@props.stats.goalieStats} />
          </TabPane>
        </div>
      </div>
    </div>

module.exports = Stats