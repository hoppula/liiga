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

  matchLink: (match) ->
    if moment(match.date) < moment()
      <a href="/ottelut/#{match.id}">{match.home} - {match.away}</a>
    else
      <span>{match.home} - {match.away}</span>

  groupedSchedule: ->
    _.chain(@props.schedule).groupBy (match) ->
      moment(match.date).format("YYYY-MM")

  render: ->
    monthlyMatches = @groupedSchedule().map (matches, month) =>
      <tbody>
        <tr>
          <th colSpan=4>{moment(month, "YYYY-MM").format("MMMM")}</th>
        </tr>
        {matches.map (match) =>
          <tr key={match.id}>
            <td>{moment(match.date).format("DD.MM.YYYY")} {match.time}</td>
            <td>{@matchLink(match)}</td>
            <td>{match.homeScore}-{match.awayScore}</td>
            <td>{match.attendance}</td>
          </tr>
        }
      </tbody>

    <div>
      <Navigation />

      <h1>Otteluohjelma</h1>

      <div className="table-responsive">
        <table className="table table-striped team-schedule">
          {monthlyMatches}
        </table>
      </div>
    </div>

module.exports = Schedule