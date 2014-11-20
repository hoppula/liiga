React = require 'react/addons'

# {Row, Col, Nav, NavItem, TabPane} = require 'react-bootstrap'

GameEvents = React.createClass

  event: (event, i) ->
    if event.header
      <tr key={event.header}>
        <th colSpan="3">{event.header}</th>
      </tr>
    else
      <tr key={i}>
        <td>{@props.game[event.team]}</td>
        <td>{event.time}</td>
        <td>{event.text}</td>
      </tr>

  render: ->
    events = Object.keys(@props.events).reduce (arr, key) =>
      arr.push header: key
      arr = arr.concat @props.events[key]
      arr
    , []

    <div className="table-responsive">
      <table className="table table-striped">
        {events.map (event, i) =>
          @event(event, i)
        }
      </table>
    </div>

module.exports = GameEvents