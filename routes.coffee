import React from 'react'

import Index from './components/index'
import Team from './components/team'
import Player from './components/player'
import Game from './components/game'
import Schedule from './components/schedule'
import Standings from './components/standings'
import Stats from './components/stats'

export default
  "/": Index
  "/joukkueet/:id/:active?": Team
  "/joukkueet/:id/:pid/:slug": Player
  "/ottelut": Schedule
  "/ottelut/:id/:active?/:away?": Game
  "/sarjataulukko": Standings
  "/tilastot/:active?": Stats
