React = require 'react'

TeamSchedule = React.createClass

  render: ->
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Date</th>
          <th>Teams</th>
          <th>Score</th>
          <th>Attendance</th>
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