React = require 'react/addons'
PlayerStats = require './player_stats'
TeamSchedule = require './team_schedule'
TeamRoster = require './team_roster'
Navigation = require './navigation'
Teams = require '../lib/teams'

{TabbedArea, TabPane, Jumbotron, ButtonToolbar, Button, Col, Row} = require "react-bootstrap"

Team = React.createClass

  logo: ->
    <img src={Teams.logo(@props.team.info.name)} alt={@props.team.info.name} />

  render: ->
    teams =
      title: "Joukkueet",
      items: @props.teams.map (team) ->
        title: team.name
        url: team.url

    <div>
      <Navigation dropdown={teams} />

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

        <TabbedArea defaultActiveKey={1} animation={false}>
          <TabPane key={1} tab="Ottelut">
            <h1>Ottelut</h1>
            <TeamSchedule team={@props.team} />
          </TabPane>
          <TabPane key={2} tab="Pelaajat">
            <h1>Pelaajat</h1>
            <TeamRoster teamId={@props.id} roster={@props.team.roster} />
          </TabPane>
        </TabbedArea>
      </div>
    </div>

module.exports = Team