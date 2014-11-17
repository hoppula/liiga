React = require 'react/addons'
{TabPane, Nav, NavItem} = require "react-bootstrap"
Navigation = require './navigation'

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
          <NavItem href="/tilastot" key="players">Kenttäpelaajat</NavItem>
          <NavItem href="/tilastot/maalivahdit" key="goalies">Maalivahdit</NavItem>
        </Nav>
        <div className="tab-content" ref="panes">
          <TabPane key="players" active={activeKey is "players"}>
            <h2>Kenttäpelaajat</h2>

          </TabPane>
          <TabPane key="goalies" active={activeKey is "goalies"}>
            <h2>Maalivahdit</h2>

          </TabPane>
        </div>
      </div>
    </div>

module.exports = Stats