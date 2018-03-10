import React from 'react'
import moment from 'moment'

import Navigation from './shared/navigation'

getPlayer = (team, params) ->
  team.roster?.filter((player) ->
    player.id is "#{params.pid}/#{params.slug}"
  )[0] or {}

export default Player = React.createClass
  statics:
    title: (props, request) ->
      player = getPlayer(props.team, request.params)
      "Pelaajat - #{player.firstName} #{player.lastName}"

    stores: (request) ->
      team: {id: request.params.id}

    preprocess: (props, request) ->
      props.id = request.params.pid
      props.player = getPlayer(props.team, request.params)
      props

  render: ->
    player = @props.player
    team = @props.team
    teamRoster = team.roster or []
    teamStats = team.stats or {}
    teamInfo = team.info or {}
    item =
      title: team.info?.name
      url: team.info?.url

    players =
      title: "Pelaajat",
      items: teamRoster.map (player) =>
        title: "#{player.firstName} #{player.lastName}"
        url: "/joukkueet/#{team.info.id}/#{player.id}"

    statsType = if player.position is "MV" then "goalies" else "players"
    stats = (teamStats[statsType] or []).filter((player) =>
      [id, slug] = player.id.split("/")
      id is @props.id
    )[0] or {}

    position = switch player.position
      when "OL" then "Oikea laitahyökkääjä"
      when "VL" then "Vasen laitahyökkääjä"
      when "KH" then "Keskushyökkääjä"
      when "VP" then "Vasen puolustaja"
      when "OP" then "Oikea puolustaja"
      when "MV" then "Maalivahti"

    birthday = moment(player.birthday)
    shoots = if player.shoots is "L" then "Vasemmalta" else "Oikealta"

    statsTable = switch statsType
      when "goalies"
        <table className="table">
          <thead>
            <tr>
              <th>PO</th>
              <th>V</th>
              <th>T</th>
              <th>H</th>
              <th>TO</th>
              <th>PM</th>
              <th>NP</th>
              <th>KA</th>
              <th>T%</th>
              <th>M</th>
              <th>S</th>
              <th>P</th>
              <th>R</th>
              <th>V%</th>
              <th>Aika</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{stats.games}</td>
              <td>{stats.wins}</td>
              <td>{stats.ties}</td>
              <td>{stats.losses}</td>
              <td>{stats.saves}</td>
              <td>{stats.goalsAllowed}</td>
              <td>{stats.shutouts}</td>
              <td>{stats.goalsAverage}</td>
              <td>{stats.savingPercentage}</td>
              <td>{stats.goals}</td>
              <td>{stats.assists}</td>
              <td>{stats.points}</td>
              <td>{stats.penalties}</td>
              <td>{stats.winPercentage}</td>
              <td>{stats.minutes}</td>
            </tr>
          </tbody>
        </table>
      when "players"
        <table className="table">
          <thead>
            <tr>
              <th>O</th>
              <th>M</th>
              <th>S</th>
              <th>P</th>
              <th>R</th>
              <th>+/-</th>
              <th>+</th>
              <th>-</th>
              <th>YVM</th>
              <th>AVM</th>
              <th>VM</th>
              <th>L</th>
              <th>L%</th>
              <th>A</th>
              <th>A%</th>
              <th>Aika</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{stats.games}</td>
              <td>{stats.goals}</td>
              <td>{stats.assists}</td>
              <td>{stats.points}</td>
              <td>{stats.penalties}</td>
              <td>{stats.plusMinus}</td>
              <td>{stats.plusses}</td>
              <td>{stats.minuses}</td>
              <td>{stats.powerPlayGoals}</td>
              <td>{stats.shortHandedGoals}</td>
              <td>{stats.winningGoals}</td>
              <td>{stats.shots}</td>
              <td>{stats.shootingPercentage}</td>
              <td>{stats.faceoffs}</td>
              <td>{stats.faceoffPercentage}</td>
              <td>{stats.playingTimeAverage}</td>
            </tr>
          </tbody>
        </table>

    <div className="player">
      <Navigation dropdown={players} />

      <h1>{player.firstName} {player.lastName}</h1>

      <h2><a className="team-logo #{teamInfo.id}" href="/joukkueet/#{teamInfo.id}"></a> #{player.number}</h2>

      <div><strong>Pelipaikka</strong> {position}</div>
      <div><strong>Syntynyt</strong> {birthday.format("DD.MM.YYYY")} ({moment().diff(player.birthday, "years")} vuotias)</div>
      <div><strong>Pituus</strong> {player.height} cm</div>
      <div><strong>Paino</strong> {player.weight} kg</div>
      <div><strong>Laukoo</strong> {shoots}</div>

      <div className="table-responsive">
        {statsTable}
      </div>

    </div>

