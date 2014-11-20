React = require 'react/addons'

Navigation = require './navigation'

{Row, Col, Nav, NavItem, TabPane} = require 'react-bootstrap'

GameEvents = require './game_events'
GameLineups = require './game_lineups'
GameStats = require './game_stats'

Game = React.createClass

  componentDidMount: ->
    window.scrollTo(0,0)

  render: ->
    activeKey = switch @props.active
      when "tilastot" then "stats"
      when "ketjut" then "lineUps"
      else "events"

    # console.log "events", @props.events
    # console.log "lineups", @props.lineUps
    #console.log "stats", @props.stats
    # console.log "game", @props.game

    <div>
      <Navigation />

      <Row>
        <Col xs={4} md={4}>
          <h1>{@props.game.home}</h1>
        </Col>

        <Col xs={4} md={4}>
          <h1>{@props.game.homeScore} - {@props.game.awayScore}</h1>
          <div>Yleisöä: {@props.game.attendance}</div>
        </Col>

        <Col xs={4} md={4}>
          <h1>{@props.game.away}</h1>
        </Col>
      </Row>

      <Nav bsStyle="tabs" activeKey={activeKey} ref="tabs">
        <NavItem href="/ottelut/#{@props.id}" eventKey="events">Tapahtumat</NavItem>
        <NavItem href="/ottelut/#{@props.id}/tilastot" eventKey="stats">Tilastot</NavItem>
        <NavItem href="/ottelut/#{@props.id}/ketjut" eventKey="lineUps">Ketjut</NavItem>
      </Nav>

      <div className="tab-content" ref="panes">
        <TabPane key="events" animation={false} active={activeKey is "events"}>
          <GameEvents events={@props.events} game={@props.game} />
        </TabPane>

        <TabPane key="stats" animation={false} active={activeKey is "stats"}>
          <GameStats stats={@props.stats} />
        </TabPane>

        <TabPane key="lineUps" animation={false} active={activeKey is "lineUps"}>
          <GameLineups lineUps={@props.lineUps} />
        </TabPane>
      </div>

    </div>

module.exports = Game