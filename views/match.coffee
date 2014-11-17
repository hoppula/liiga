React = require 'react/addons'

Navigation = require './navigation'

{Row, Col, Nav, NavItem, TabPane} = require 'react-bootstrap'

Match = React.createClass

  componentDidMount: ->
    window.scrollTo(0,0)

  event: (event) ->
    if event.header
      <tr>
        <th colSpan="3">{event.header}</th>
      </tr>
    else
      <tr>
        <td>{@props.game[event.team]}</td>
        <td>{event.time}</td>
        <td>{event.text}</td>
      </tr>

  render: ->
    activeKey = switch @props.active
      when "tilastot" then "stats"
      when "ketjut" then "lineUps"
      else "events"

    console.log "events", @props.events
    console.log "lineups", @props.lineUps
    console.log "stats", @props.stats
    console.log "game", @props.game

    events = Object.keys(@props.events).reduce (arr, key) =>
      arr.push header: key
      arr = arr.concat @props.events[key]
      arr
    , []

    <div>
      <Navigation />

      <Row>
        <Col xs={4} md={4}>
          <h1>{@props.game.home}</h1>
        </Col>

        <Col xs={4} md={4}>
          <h1>{@props.game.homeScore} - {@props.game.awayScore}</h1>
          <div>Yleisöä: {@props.game.attendance}</div>
        </Col>

        <Col xs={4} md={4}>
          <h1>{@props.game.away}</h1>
        </Col>
      </Row>

      <Nav bsStyle="tabs" activeKey={activeKey} ref="tabs">
        <NavItem href="/ottelut/#{@props.id}" key="events">Tapahtumat</NavItem>
        <NavItem href="/ottelut/#{@props.id}/tilastot" key="stats">Tilastot</NavItem>
        <NavItem href="/ottelut/#{@props.id}/ketjut" key="lineUps">Ketjut</NavItem>
      </Nav>

      <div className="tab-content" ref="panes">
        <TabPane key="events" active={activeKey is "events"}>
          <div className="table-responsive">
            <table className="table table-striped">
              {events.map (event) =>
                @event(event)
              }
            </table>
          </div>
        </TabPane>

        <TabPane key="stats" active={activeKey is "stats"}>
          <div className="table-responsive">
            <table className="table table-striped">
              {@props.stats.home.players.map (player) ->
                <tr><td>{player.firstName} {player.lastName}</td></tr>
              }

              {@props.stats.home.goalies.map (goalie) ->
                <tr><td>{goalie.firstName} {goalie.lastName}</td></tr>
              }
            </table>

            <table className="table table-striped">
              {@props.stats.away.players.map (player) ->
                <tr><td>{player.firstName} {player.lastName}</td></tr>
              }

              {@props.stats.away.goalies.map (goalie) ->
                <tr><td>{goalie.firstName} {goalie.lastName}</td></tr>
              }
            </table>
          </div>
        </TabPane>

        <TabPane key="lineUps" active={activeKey is "lineUps"}>
          <div className="table-responsive">
            <table className="table table-striped">
            </table>
          </div>
        </TabPane>
      </div>

    </div>

module.exports = Match