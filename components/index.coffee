import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import moment from 'moment'

import TeamsList from './index/teams_list'
import RecentSchedule from './index/recent_schedule'
import StandingsTable from './shared/standings_table'
import Navigation from './shared/navigation'
import Spinner from './shared/spinner'

moment.locale('fi'
  months : [
    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu",
    "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
  ]
)
moment.locale('fi')

export default Index = React.createClass
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
