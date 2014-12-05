React = require 'react/addons'
_ = require 'lodash'

GameEvents = React.createClass

  event: (event, i) ->
    if event.header
      <tr key={event.header}>
        <th colSpan="3">{event.header}</th>
      </tr>
    else if event.team and event.time
      <tr key={i}>
        <td>{@props.game[event.team]}</td>
        <td>{event.time}</td>
        <td>{event.text}</td>
      </tr>
    else if event.team and not event.time
      home = if event.team is "home" then event.text else ""
      away = if event.team is "away" then event.text else ""
      <tr key={i}>
        <td>{home}</td>
        <td></td>
        <td>{away}</td>
      </tr>
    else
      <tr key={i}>
        <td>{event.home}</td>
        <td>{event.time}</td>
        <td>{event.away}</td>
      </tr>

  render: ->
    periodEvents = Object.keys(_.pick(@props.events, "1. erä", "2. erä", "3. erä")).reduce (arr, key) =>
      arr.push header: key
      arr = arr.concat @props.events[key]
      arr
    , []

    otherEvents = Object.keys(_.omit(@props.events, "1. erä", "2. erä", "3. erä")).reduce (arr, key) =>
      arr.push header: key
      arr = arr.concat @props.events[key]
      arr
    , []

    <div>

      <table className="table table-striped game-events">
        {periodEvents.map (event, i) =>
          @event(event, i)
        }
      </table>

      <table className="table table-striped game-events other-events">
        {otherEvents.map (event, i) =>
          @event(event, i)
        }
      </table>

    </div>



module.exports = GameEvents