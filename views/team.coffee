React = require 'react/addons'
TeamSchedule = require './team_schedule'
TeamStats = require './team_stats'
TeamRoster = require './team_roster'
Navigation = require './navigation'
Teams = require '../lib/teams'

{TabPane, Jumbotron, ButtonToolbar, Button, Col, Row, Nav, NavItem} = require "react-bootstrap"

Team = React.createClass

  componentDidMount: ->
    window.scrollTo(0,0)

  logo: ->
    <img src={Teams.logo(@props.team.info.name)} alt={@props.team.info.name} />

  render: ->
    activeKey = switch @props.active
      when "pelaajat" then "players"
      when "tilastot" then "stats"
      else "schedule"

    <div>
      <Navigation />

      <div className="team">
        <Jumbotron>
          <Row>
            <Col xs={12} md={6}>
              <h1>{@logo()} {@props.team.info.name}</h1>
            </Col>
            <Col xs={12} md={6}>
              <div className="team-container">
                <ul>
                  <li>{@props.team.info.longName}</li>
                  <li>{@props.team.info.address}</li>
                  <li>{@props.team.info.email}</li>
                </ul>

                <ButtonToolbar>
                  <Button bsStyle="primary" bsSize="large" href={@props.team.info.ticketsUrl}>Liput</Button>
                  <Button bsStyle="primary" bsSize="large" href={@props.team.info.locationUrl}>Hallin sijainti</Button>
                </ButtonToolbar>
              </div>
            </Col>
          </Row>
        </Jumbotron>

        <div>
          <Nav bsStyle="tabs" activeKey={activeKey} ref="tabs">
            <NavItem href="/joukkueet/#{@props.id}" eventKey="schedule">Ottelut</NavItem>
            <NavItem href="/joukkueet/#{@props.id}/tilastot" eventKey="stats">Tilastot</NavItem>
            <NavItem href="/joukkueet/#{@props.id}/pelaajat" eventKey="players">Pelaajat</NavItem>
          </Nav>
          <div className="tab-content" ref="panes">
            <TabPane key="schedule" animation={false} active={activeKey is "schedule"}>
              <h1>Ottelut</h1>
              <TeamSchedule team={@props.team} />
            </TabPane>
            <TabPane key="stats" animation={false} active={activeKey is "stats"}>
              <h1>Tilastot</h1>
              <TeamStats teamId={@props.id} stats={@props.team.stats} />
            </TabPane>
            <TabPane key="players" animation={false} active={activeKey is "players"}>
              <h1>Pelaajat</h1>
              <TeamRoster teamId={@props.id} roster={@props.team.roster} />
            </TabPane>
          </div>
        </div>

      </div>
    </div>

module.exports = Team