React = require 'react'
moment = require 'moment'
_ = require 'lodash'

Teams = require '../../lib/teams'

moment.locale('fi'
  months : [
    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu",
    "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
  ]
)
moment.locale('fi')

TeamSchedule = React.createClass

  gameLink: (game) ->
    if moment(game.date) < moment()
      <a href="/ottelut/#{game.id}">{@titleStyle(game.home)} - {@titleStyle(game.away)}</a>
    else
      <span>{@titleStyle(game.home)} - {@titleStyle(game.away)}</span>

  titleStyle: (name) ->
    if @props.team.info.name is name
      <strong>{name}</strong>
    else
      name

  logo: (name) ->
    <img src={Teams.logo(name)} alt={name} />

  groupedSchedule: ->
    _.chain(@props.team.schedule).groupBy (game) ->
      moment(game.date).format("YYYY-MM")

  render: ->
    attendanceTitle = (month) ->
      if moment(month).startOf("month") < moment()
        "Yleisöä"
      else
        null

    monthlyGames = @groupedSchedule().map (games, month) =>
      <tbody key={month}>
        <tr className="month-row">
          <th colSpan=3>{moment(month, "YYYY-MM").format("MMMM")}</th>
          <th>{attendanceTitle(month)}</th>
        </tr>
        {games.map (game) =>
          <tr key={game.id}>
            <td>{moment(game.date).format("DD.MM.YYYY")} {game.time}</td>
            <td>{@gameLink(game)}</td>
            <td>{game.homeScore}-{game.awayScore}</td>
            <td>{game.attendance}</td>
          </tr>
        }
      </tbody>

    <div className="team-schedule table-responsive">
      <table className="table table-striped team-schedule">
        {monthlyGames.value()}
      </table>
    </div>

module.exports = TeamSchedule