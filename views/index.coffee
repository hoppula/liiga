React = require 'react/addons'

Navigation = require './navigation'
TeamsList = require './teams_list'
StandingsTable = require './standings_table'
RecentSchedule = require './recent_schedule'

{Grid, Row, Col} = require 'react-bootstrap'

Index = React.createClass

  componentDidMount: ->
    window.scrollTo(0,0)

  render: ->
    <div>
      <Navigation />

      <div className="jumbotron front-jumbo">
        <h1>LiigaOpas</h1>
        <p>SM-Liigan tilastot nopeasti ja vaivattomasti</p>
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