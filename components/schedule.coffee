import React from 'react'
import moment from 'moment'
import _ from 'lodash'

import Teams from '../lib/teams'
import Navigation from './shared/navigation'
import Spinner from './shared/spinner'

export default Schedule = React.createClass
  statics:
    title: "Otteluohjelma"
    stores: (request) ->
      schedule: {}

  getInitialState: ->
    firstDate: moment().startOf("month")
    lastDate: moment().endOf("month")
    previousVisible: false
    nextVisible: false

  componentDidMount: ->
    window.scrollTo(0,0)

  monthRanges: ->
    [firstGame, ..., lastGame] = @props.schedule
    [moment(firstGame.date).startOf("month"), moment(lastGame.date).endOf("month")]

  gameLink: (game) ->
    if moment(game.date).endOf("day") < moment()
      <a href="/ottelut/#{game.id}">{game.home} - {game.away}</a>
    else
      <span>{game.home} - {game.away}</span>

  showPrevious: ->
    if not @state.previousVisible
      <table className="table table-striped">
        <tbody>
          <tr>
            <th className="load-more" colSpan={4} onClick={@loadPrevious}>Näytä edelliset kuukaudet...</th>
          </tr>
        </tbody>
      </table>
    else
      null

  showNext: ->
    if not @state.nextVisible
      <table className="table table-striped">
        <tbody>
          <tr>
            <th className="load-more" colSpan={4} onClick={@loadNext}>Näytä seuraavat kuukaudet...</th>
          </tr>
        </tbody>
      </table>
    else
      null

  loadPrevious: ->
    [firstDate] = @monthRanges()
    @setState(firstDate: firstDate, previousVisible: true)

  loadNext: ->
    [..., lastDate] = @monthRanges()
    @setState(lastDate: lastDate, nextVisible: true)

  groupedSchedule: ->
    _.chain(@props.schedule).filter (game) =>
      gameDate = moment(game.date)
      gameDate >= @state.firstDate and gameDate <= @state.lastDate
    .groupBy (game) ->
      moment(game.date).format("YYYY-MM")

  monthlyGames: ->
    @groupedSchedule().map (games, month) =>
      datesWithGames = _.chain(games).groupBy (game) ->
        moment(game.date).format("DD.MM.YYYY")
      .value()

      <table className="table table-striped team-schedule" key={month}>
        <tbody>
          <tr>
            <th colSpan={4}>{moment(month, "YYYY-MM").format("MMMM")}</th>
          </tr>
        </tbody>
        {for gameDate, games of datesWithGames
          <tbody key={gameDate}>
            <tr>
              <th className="game-date" colSpan={4}>{gameDate}</th>
            </tr>
            {games.map (game) =>
              <tr key={game.id}>
                <td>{game.time}</td>
                <td>{@gameLink(game)}</td>
                <td>{game.homeScore}-{game.awayScore}</td>
                <td>{game.attendance}</td>
              </tr>
            }
          </tbody>
        }
      </table>

  render: ->

    if !@props.schedule.length
      return (
          <div className="schedule">
            <Navigation />

            <h1>Otteluohjelma</h1>

            <div className="table-responsive">
              <Spinner />
            </div>
          </div>
      )

    <div className="schedule">
      <Navigation />

      <h1>Otteluohjelma</h1>

      <div className="table-responsive">
        {@showPrevious()}
        {@monthlyGames().value()}
        {@showNext()}
      </div>
    </div>
