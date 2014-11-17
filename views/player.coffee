React = require 'react/addons'
moment = require 'moment'

Navigation = require './navigation'

Player = React.createClass

  render: ->
    player = @props.player
    team = @props.team

    players =
      title: "Pelaajat",
      items: team.roster.map (player) =>
        title: "#{player.firstName} #{player.lastName}"
        url: "/joukkueet/#{team.info.id}/#{player.id}"

    # TODO: check position, KH OL VL P use players, MV use goalies
    stats = team.stats.players.filter((player) =>
      [id, slug] = player.id.split("/")
      id is @props.id
    )[0]

    item =
      title: team.info.name
      url: team.info.url

    console.log "player", player
    console.log "team", team
    console.log "stats", stats

    <div className="player">
      <Navigation dropdown={players} item={item} />

      <h1>{player.firstName} {player.lastName}</h1>

      <h2>#{player.number} {player.position}</h2>

      <h3><a className="team-logo #{team.info.id}" href="/joukkueet/#{team.info.id}"></a> {team.info.name}</h3>

      <div>{moment(player.birthday).format("DD.MM.YYYY")}</div>
      <div>{player.height} cm</div>
      <div>{player.weight} kg</div>
      <div>{player.shoots}</div>

      <div className="table-responsive">
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
      </div>

    </div>

module.exports = Player