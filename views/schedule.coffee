React = require 'react/addons'
moment = require 'moment'
_ = require 'lodash'

Navigation = require './navigation'
Teams = require '../lib/teams'

moment.locale('fi'
  months : [
    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu",
    "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
  ]
)
moment.locale('fi')

Schedule = React.createClass

  componentDidMount: ->
    window.scrollTo(0,0)

  gameLink: (game) ->
    if moment(game.date) < moment()
      <a href="/ottelut/#{game.id}">{game.home} - {game.away}</a>
    else
      <span>{game.home} - {game.away}</span>

  groupedSchedule: ->
    _.chain(@props.schedule).groupBy (game) ->
      moment(game.date).format("YYYY-MM")

  render: ->
    monthlyGames = @groupedSchedule().map (games, month) =>
      <tbody>
        <tr>
          <th colSpan=4>{moment(month, "YYYY-MM").format("MMMM")}</th>
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

    <div>
      <Navigation />

      <h1>Otteluohjelma</h1>

      <div className="table-responsive">
        <table className="table table-striped team-schedule">
          {monthlyGames}
        </table>
      </div>
    </div>

module.exports = Schedule