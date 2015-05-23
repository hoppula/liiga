React = require 'react'
moment = require 'moment'
{Row, Col, Nav, NavItem, TabPane} = require 'react-bootstrap'

Teams = require '../lib/teams'

GameEvents = require './game/game_events'
GameLineups = require './game/game_lineups'
GameStats = require './game/game_stats'
Navigation = require './shared/navigation'

getGame = (schedule, id) ->
  schedule.filter((g) ->
    g.id is id
  )[0] or {}

Game = React.createClass

  statics:
    title: (props, request) ->
      game = getGame(props.schedule, request.params.id)
      "Ottelu - #{game.home} vs #{game.away}"

    stores: (request) ->
      schedule: {}
      gameEvents: {id: request.params.id}
      gameLineups: {id: request.params.id}
      gameStats: {id: request.params.id}

    preprocess: (props, request) ->
      props.id = request.params.id
      props.game = getGame(props.schedule, request.params.id)
      props.active = request.params.active
      props.away = !!request.params.away
      props

  componentDidMount: ->
    window.scrollTo(0,0)

  logo: (teamName) ->
    <img src={Teams.logo(teamName)} alt={teamName} />

  render: ->
    activeKey = switch @props.active
      when "tilastot" then "stats"
      when "ketjut" then "lineUps"
      else "events"

    game = @props.game
    gameTime = game.time or ""
    [hours, minutes] = gameTime.split(":")

    <div className="game">
      <Navigation />

      <Row>
        <Col className="home" xs={4} md={4}>
          <h1>{game.home}</h1>
          {@logo(game.home)}
        </Col>

        <Col className="score" xs={4} md={4}>
          <h1>{game.homeScore} - {game.awayScore}</h1>
          <ul>
            <li>{moment(game.date).add(hours, 'hours').add(minutes, 'minutes').format("DD.MM.YYYY HH:mm")}</li>
            <li>Yleisöä: {game.attendance}</li>
          </ul>
        </Col>

        <Col className="away" xs={4} md={4}>
          <h1>{game.away}</h1>
          {@logo(game.away)}
        </Col>
      </Row>

      <Nav bsStyle="tabs" activeKey={activeKey} ref="tabs">
        <NavItem href="/ottelut/#{@props.id}" eventKey="events">Tapahtumat</NavItem>
        <NavItem href="/ottelut/#{@props.id}/tilastot" eventKey="stats">Tilastot</NavItem>
        <NavItem href="/ottelut/#{@props.id}/ketjut" eventKey="lineUps">Ketjut</NavItem>
      </Nav>

      <div className="tab-content" ref="panes">
        <TabPane key="events" animation={false} active={activeKey is "events"}>
          <GameEvents events={@props.gameEvents} game={@props.game} />
        </TabPane>

        <TabPane key="stats" animation={false} active={activeKey is "stats"}>
          <GameStats id={@props.id} stats={@props.gameStats} away={@props.away} />
        </TabPane>

        <TabPane key="lineUps" animation={false} active={activeKey is "lineUps"}>
          <GameLineups id={@props.id} lineUps={@props.gameLineups} />
        </TabPane>
      </div>

    </div>

module.exports = Game