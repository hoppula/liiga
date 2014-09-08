React = require 'react'

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
      {@props.schedule.map (match) ->
        <tr>
          <td>{match.date} {match.time}</td>
          <td>{match.home} - {match.visitor}</td>
          <td>{match.homeScore}-{match.visitorScore}</td>
          <td>{match.attendance}</td>
        </tr>
      }
    </table>

module.exports = TeamSchedule