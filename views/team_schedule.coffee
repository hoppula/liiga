React = require 'react/addons'
moment = require 'moment'

TeamSchedule = React.createClass

  render: ->
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Päivämäärä</th>
          <th>Joukkueet</th>
          <th>Tulos</th>
          <th>Yleisömäärä</th>
        </tr>
      </thead>
      {@props.schedule.map (match, i) ->
        <tr key={match.id}>
          <td>{moment(match.date).format("DD.MM.YYYY")} {match.time}</td>
          <td>{match.home} - {match.visitor}</td>
          <td>{match.homeScore}-{match.visitorScore}</td>
          <td>{match.attendance}</td>
        </tr>
      }
    </table>

module.exports = TeamSchedule