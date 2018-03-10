import React from 'react'
import { Nav, NavItem, Tabs, Tab } from 'react-bootstrap'

import Teams from '../../lib/teams'
import Spinner from '../shared/spinner'
import PlayerStats from '../shared/player_stats'
import GoalieStats from '../shared/goalie_stats'

export default GameStats = React.createClass
  render: ->
    if !Object.keys(@props.stats).length
      return (
        <div className="table-responsive">
          <Spinner />
        </div>
      )

    home = @props.stats.home or {}
    away = @props.stats.away or {}
    homeId = Teams.nameToId(home.team)
    awayId = Teams.nameToId(away.team)
    activeKey = if @props.away then "away" else "home"

    <div className="game-stats">
      <Nav bsStyle="tabs" activeKey={activeKey} ref="tabs">
        <NavItem href="/ottelut/#{@props.id}/tilastot" eventKey="home">{home.team}</NavItem>
        <NavItem href="/ottelut/#{@props.id}/tilastot/vieras" eventKey="away">{away.team}</NavItem>
      </Nav>

      <Tabs activeKey={activeKey} animation={false}>
        <Tab eventKey="home">
          <PlayerStats teamId={homeId} stats={home.players} />
          <GoalieStats teamId={homeId} stats={home.goalies} playedAtLeast={0} />
        </Tab>
        <Tab eventKey="away">
          <PlayerStats teamId={awayId} stats={away.players} />
          <GoalieStats teamId={awayId} stats={away.goalies} playedAtLeast={0} />
        </Tab>
      </Tabs>
    </div>
