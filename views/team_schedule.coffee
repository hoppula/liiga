React = require 'react/addons'
moment = require 'moment'
_ = require 'lodash'

Teams = require '../lib/teams'

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
    monthlyGames = @groupedSchedule().map (games, month) =>
      <tbody key={month}>
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

    <div className="table-responsive">
      <table className="table table-striped team-schedule">
        <thead>
          <tr>
            <th>Päivämäärä</th>
            <th>Joukkueet</th>
            <th>Tulos</th>
            <th>Yleisömäärä</th>
          </tr>
        </thead>
        {monthlyGames}
      </table>
    </div>

module.exports = TeamSchedule