React = require 'react/addons'

# {Row, Col, Nav, NavItem, TabPane} = require 'react-bootstrap'

GameStats = React.createClass

  render: ->
    <div className="table-responsive">
      <table className="table table-striped">
        {@props.stats.home.players.map (player) ->
          <tr key={player.id}><td>{player.firstName} {player.lastName}</td></tr>
        }

        {@props.stats.home.goalies.map (goalie) ->
          <tr key={goalie.id}><td>{goalie.firstName} {goalie.lastName}</td></tr>
        }
      </table>

      <table className="table table-striped">
        {@props.stats.away.players.map (player) ->
          <tr key={player.id}><td>{player.firstName} {player.lastName}</td></tr>
        }

        {@props.stats.away.goalies.map (goalie) ->
          <tr key={goalie.id}><td>{goalie.firstName} {goalie.lastName}</td></tr>
        }
      </table>
    </div>

module.exports = GameStats