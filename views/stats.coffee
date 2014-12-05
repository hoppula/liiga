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
            <div className="table-responsive">
              <PlayerStats stats={@props.stats.scoringStats} limit={100} />
            </div>
          </TabPane>
          <TabPane key="goalies" animation={false} active={activeKey is "goalies"}>
            <h2>Maalivahdit (yli 25% pelanneet)</h2>
            <div className="table-responsive">
              <GoalieStats stats={@props.stats.goalieStats} playedAtLeast={25} />
            </div>
          </TabPane>
        </div>
      </div>
    </div>

module.exports = Stats