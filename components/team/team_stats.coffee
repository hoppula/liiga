import React from 'react'

import PlayerStats from '../shared/player_stats'
import GoalieStats from '../shared/goalie_stats'

export default TeamStats = React.createClass
  render: ->
    stats = @props.stats or {}
    <div className="table-responsive">
      <PlayerStats stats={stats.players} />
      <GoalieStats stats={stats.goalies} />
    </div>
