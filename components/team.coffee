import React from 'react'
import { Tabs, Tab, Jumbotron, ButtonToolbar, Button, Col, Row, Nav, NavItem } from "react-bootstrap"

import Teams from '../lib/teams'
import TeamSchedule from './team/team_schedule'
import TeamStats from './team/team_stats'
import TeamRoster from './team/team_roster'
import Navigation from './shared/navigation'
import Spinner from './shared/spinner'

export default Team = React.createClass
  statics:
    title: (props, request) ->
      subTitle = switch request.params.active
        when "pelaajat" then "Pelaajat"
        when "tilastot" then "Tilastot"
        else "Otteluohjelma"

      "Joukkueet - #{props.team.info?.name} - #{subTitle}"

    stores: (request) ->
      standings: {}
      team: {id: request.params.id}

    preprocess: (props, request) ->
      props.id = request.params.id
      props.active = request.params.active
      props

  componentDidMount: ->
    window.scrollTo(0,0)

  logo: ->
    <img src={Teams.logo(@props.team.info.name)} alt={@props.team.info.name} />

  render: ->
    activeKey = switch @props.active
      when "pelaajat" then "players"
      when "tilastot" then "stats"
      else "schedule"

    team = @props.team or {}
    teamInfo = team.info or {}

    tabs = if !Object.keys(team).length
      <div className="table-responsive">
        <Spinner />
      </div>
    else
      <Tabs activeKey={activeKey} animation={false}>
        <Tab eventKey="schedule">
          <h1>Ottelut</h1>
          <TeamSchedule team={@props.team} />
        </Tab>
        <Tab eventKey="stats">
          <h1>Tilastot</h1>
          <TeamStats teamId={@props.id} stats={@props.team.stats} />
        </Tab>
        <Tab eventKey="players">
          <h1>Pelaajat</h1>
          <TeamRoster teamId={@props.id} roster={@props.team.roster} />
        </Tab>
      </Tabs>

    return (
      <div>
        <Navigation />

        <div className="team">
          <Jumbotron>
            <Row>
              <Col xs={12} md={6}>
                <h1>{if team.info then @logo() else ""} {teamInfo.name}</h1>
              </Col>
              <Col xs={12} md={6}>
                <div className="team-container">
                  <ul>
                    <li>{teamInfo.longName}</li>
                    <li>{teamInfo.address}</li>
                    <li>{teamInfo.email}</li>
                  </ul>

                  <ButtonToolbar>
                    <Button bsStyle="primary" bsSize="large" href={teamInfo.ticketsUrl}>Liput</Button>
                    <Button bsStyle="primary" bsSize="large" href={teamInfo.locationUrl}>Hallin sijainti</Button>
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
            {tabs}
          </div>

        </div>
      </div>
    )
