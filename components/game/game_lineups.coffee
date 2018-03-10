import React from 'react'
import { Row, Col, Grid, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Spinner from '../shared/spinner'
import Teams from '../../lib/teams'

export default GameLineups = React.createClass

  lineTitle: (i) ->
    title = if i < 4
      "Kenttä #{i+1}"
    else
      "Maalivahdit"

    <Col xs={12}>
      <h2>{title}</h2>
    </Col>

  column: (type, player, teamId) ->
    columnSize = if type is "forward" then 2 else 3
    content = if player
      <OverlayTrigger placement="top" overlay={@tooltip(player)}>
        <div className="player #{teamId}">
          <a href="/joukkueet/#{teamId}/#{player.id}">#{player.number}</a>
        </div>
      </OverlayTrigger>
    else
      ""
    <Col xs={columnSize}>
      {content}
    </Col>

  tooltip: (player) ->
    <Tooltip id={player?.id}><strong>{player?.name}</strong></Tooltip>

  render: ->
    if !Object.keys(@props.lineUps).length
      return (
        <div className="table-responsive">
          <Spinner />
        </div>
      )

    home = @props.lineUps.home or {}
    away = @props.lineUps.away or {}
    homeLines = home.lines or []
    homeTeam = Teams.nameToId(home.team)
    awayTeam = Teams.nameToId(away.team)

    lines = homeLines.map (line, i) =>
      awayLine = away.lines[i]
      <Grid key={"line#{i}"}>
        <Row>
          {@lineTitle(i)}
        </Row>
        <Row>
          {@column("forward", line.forwards[0], homeTeam)}
          {@column("forward", line.forwards[1], homeTeam)}
          {@column("forward", line.forwards[2], homeTeam)}
          {@column("forward", awayLine.forwards[0], awayTeam)}
          {@column("forward", awayLine.forwards[1], awayTeam)}
          {@column("forward", awayLine.forwards[2], awayTeam)}
        </Row>
        <Row className="defenders">
          {@column("defender", line.defenders[0], homeTeam)}
          {@column("defender", line.defenders[1], homeTeam)}
          {@column("defender", awayLine.defenders[0], awayTeam)}
          {@column("defender", awayLine.defenders[1], awayTeam)}
        </Row>
        <Row className="goalies">
          {@column("goalie", line.goalies[0], homeTeam)}
          {@column("goalie", line.goalies[1], homeTeam)}
          {@column("goalie", awayLine.goalies[0], awayTeam)}
          {@column("goalie", awayLine.goalies[1], awayTeam)}
        </Row>
      </Grid>

    <div className="game-lineups">
      {lines}
    </div>
