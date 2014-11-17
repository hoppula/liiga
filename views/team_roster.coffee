React = require 'react/addons'
moment = require 'moment'
_ = require 'lodash'

TeamRoster = React.createClass

  groupedRoster: ->
    _.chain(@props.roster)
    .groupBy((player) -> player.position)
    .reduce((result, player, position) ->
      group = switch
        when _.include(["KH", "OL", "VL"], position) then "Hyökkääjät"
        when _.include(["OP", "VP"], position) then "Puolustajat"
        when position is "MV" then "Maalivahdit"
      result[group] ||= []
      result[group].push player
      result
    , {})

  render: ->
    groups = @groupedRoster().map (players, group) =>
      <tbody key={group}>
        <tr>
          <th colSpan=6>{group}</th>
        </tr>
        {_.chain(players).flatten().map (player) =>
          url = "/joukkueet/#{@props.teamId}/#{player.id}"
          title = "#{player.firstName} #{player.lastName}"
          <tr key={player.id}>
            <td><a href={url}>{title}</a></td>
            <td><strong>{player.number}</strong></td>
            <td>{player.height}</td>
            <td>{player.weight}</td>
            <td>{player.shoots}</td>
            <td>{moment().diff(player.birthday, "years")}</td>
          </tr>
        }
      </tbody>

    <div className="table-responsive">
      <table className="table table-striped team-roster">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Numero</th>
            <th>Pituus</th>
            <th>Paino</th>
            <th>Kätisyys</th>
            <th>Ikä</th>
          </tr>
        </thead>
        {groups}
      </table>
    </div>

module.exports = TeamRoster