React = require 'react'
_ = require 'lodash'
Spinner = require '../shared/spinner'

GameEvents = React.createClass

  event: (event, i) ->

    text = if (event.text or "").match(/\d-\d/) then <strong>{event.text}</strong> else event.text

    if event.header
      <tr key={event.header}>
        <th colSpan="3">{event.header}</th>
      </tr>
    else if event.team and event.time
      <tr key={i}>
        <td>{@props.game[event.team]}</td>
        <td>{event.time}</td>
        <td>{text}</td>
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
    if !Object.keys(@props.events).length
      return (
        <div className="table-responsive">
          <Spinner />
        </div>
      )

    periodEvents = Object.keys(_.pick(@props.events, "1. erä", "2. erä", "3. erä", "Jatkoaika", "Voittomaalikilpailu")).reduce (arr, key) =>
      arr.push header: key
      arr = arr.concat @props.events[key]
      arr
    , []

    stats = Object.keys(_.pick(@props.events, "Maalivahdit", "Rangaistukset")).reduce (arr, key) =>
      arr.push header: key
      arr = arr.concat @props.events[key]
      arr
    , []

    other = Object.keys(_.omit(@props.events, "1. erä", "2. erä", "3. erä", "Jatkoaika", "Voittomaalikilpailu", "Maalivahdit", "Rangaistukset")).reduce (arr, key) =>
      arr.push header: key
      arr = arr.concat @props.events[key]
      arr
    , []

    <div>

      <table className="table table-striped game-events">
        <tbody>
        {periodEvents.map (event, i) =>
          @event(event, i)
        }
        </tbody>
      </table>

      <table className="table table-striped game-events stats-events">
        <tbody>
        {stats.map (event, i) =>
          @event(event, i)
        }
        </tbody>
      </table>

      <table className="table table-striped game-events other-events">
        <tbody>
        {other.map (event, i) =>
          @event(event, i)
        }
        </tbody>
      </table>

    </div>



module.exports = GameEvents
