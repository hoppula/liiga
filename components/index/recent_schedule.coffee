React = require 'react'
{ListGroup, ListGroupItem} = require 'react-bootstrap'
moment = require 'moment'
_ = require 'lodash'

Teams = require '../../lib/teams'

moment.locale('fi'
  months : [
    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu",
    "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
  ]
)
moment.locale('fi')

RecentSchedule = React.createClass

  grouped: ->
    current = moment()
    groups = _.groupBy(@props.schedule, (game) ->
      [hour, minutes] = game.time.split(":")
      dateTime = moment(game.date).set('hour', hour).set('minute', minutes)
      dateTimeEnd = moment(dateTime).add(2.5, 'hours')
      if current > dateTime
        if current < dateTimeEnd
          "ongoing"
        else
          "past"
      else
        "future"
    )
    future = groups.future or []
    past = groups.past or []
    firstFuture = future[0]
    [..., lastPast] = past

    future: _.filter(future, (game) ->
      game.date is firstFuture.date
    )
    past: _.filter(past, (game) ->
      game.date is lastPast.date
    )
    ongoing: groups.ongoing or []

  render: ->
    grouped = @grouped()
    ongoing = if grouped.ongoing?.length
      <div className="ongoing">
        <h4>Käynnissä</h4>
        <ListGroup>
        {grouped.ongoing.map (game) ->
          teams = "#{game.home} - #{game.away}"
          url = "http://liiga.fi/ottelut/2014-2015/runkosarja/#{game.id}/seuranta/"
          <ListGroupItem key={game.id} header={teams} href={url}>ottelu alkanut {game.time}</ListGroupItem>
        }
        </ListGroup>
      </div>
    else
      null

    past = if grouped.past
      <div className="past">
        <h4>Edelliset ({moment(grouped.past[0]?.date).format("DD.MM")})</h4>
        <ListGroup>
        {grouped.past.map (game) ->
          score = if game.homeScore and game.awayScore then "#{game.homeScore}-#{game.awayScore}" else ""
          teams = "#{game.home} - #{game.away} #{score}"
          url = "/ottelut/#{game.id}"
          <ListGroupItem key={game.id} header={teams} href={url}></ListGroupItem>
        }
        </ListGroup>
      </div>
    else
      null

    future = if grouped.future
      <div className="future">
        <h4>Seuraavat ({moment(grouped.future[0]?.date).format("DD.MM")})</h4>
        <ListGroup>
        {grouped.future.map (game) ->
          teams = "#{game.home} - #{game.away}"
          <ListGroupItem key={game.id} header={teams}>ottelu alkaa {game.time}</ListGroupItem>
        }
        </ListGroup>
      </div>
    else
      null

    <div className="recent-schedule">
      {ongoing}
      {past}
      {future}
    </div>

module.exports = RecentSchedule