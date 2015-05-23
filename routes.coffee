React = require 'react'

Index = require('./components/index')
Team = require('./components/team')
Player = require('./components/player')
Game = require('./components/game')
Schedule = require('./components/schedule')
Standings = require('./components/standings')
Stats = require('./components/stats')

module.exports =
  "/": Index
  "/joukkueet/:id/:active?": Team
  "/joukkueet/:id/:pid/:slug": Player
  "/ottelut": Schedule
  "/ottelut/:id/:active?/:away?": Game
  "/sarjataulukko": Standings
  "/tilastot/:active?": Stats