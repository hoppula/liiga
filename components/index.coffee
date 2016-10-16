React = require 'react'
{Grid, Row, Col} = require 'react-bootstrap'

TeamsList = require './index/teams_list'
RecentSchedule = require './index/recent_schedule'
StandingsTable = require './shared/standings_table'
Navigation = require './shared/navigation'
Spinner = require './shared/spinner'

Index = React.createClass

  statics:
    title: "Etusivu"
    stores: (request) ->
      standings: {}
      schedule: {}
      teams: {}

  componentDidMount: ->
    window.scrollTo(0,0)

  render: ->
    <div>
      <Navigation />

      <div className="jumbotron front-jumbo">
        <h1>LiigaOpas</h1>
        <p>Liigan tilastot nopeasti ja vaivattomasti</p>
      </div>

      <TeamsList teams={@props.teams} />

      <Grid>
        <Row>
          <Col xs={12} sm={6}>
            <h3>Ottelut</h3>
            <RecentSchedule schedule={@props.schedule} />
          </Col>
          <Col xs={12} sm={6}>
            <h3>Sarjataulukko</h3>
            <div className="standings standings-front table-responsive">
              <StandingsTable standings={@props.standings} />
            </div>
          </Col>
        </Row>
      </Grid>

    </div>

module.exports = Index
