Q = require 'q'
React = require 'react/addons'

IndexView = require './views/index'
TeamView = require './views/team'
PlayerView = require './views/player'
GameView = require './views/game'
ScheduleView = require './views/schedule'
StandingsView = require './views/standings'
StatsView = require './views/stats'

module.exports =
  "/": ->
    Q.spread [
      @store.fetch("standings")
      @store.fetch("schedule")
      @store.fetch("teams")
    ], (standings, schedule, teamsList) ->
      title: "Etusivu"
      component: React.createElement IndexView,
        standings: standings
        teams: teamsList
        schedule: schedule

  "/joukkueet/:id/:active?": (id, active) ->
    Q.spread [
      @store.fetch("standings")
      @store.fetch("team", id: id)
    ], (standings, team) ->

      subTitle = switch active
        when "pelaajat" then "Pelaajat"
        when "tilastot" then "Tilastot"
        else "Otteluohjelma"

      title: "Joukkueet - #{team.info?.name} - #{subTitle}"
      component: React.createElement TeamView,
        id: id
        standings: standings
        team: team
        active: active

  "/joukkueet/:id/:pid/:slug": (id, pid, slug) ->
    @store.fetch("team", id: id).then (team) ->
      player = team.roster?.filter((player) ->
        player.id is "#{pid}/#{slug}"
      )[0] or {}
      title: "Pelaajat - #{player.firstName} #{player.lastName}"
      component: React.createElement PlayerView,
        id: pid
        player: player
        team: team

  "/ottelut": ->
    @store.fetch("schedule").then (schedule) ->
      title: "Otteluohjelma"
      component: React.createElement ScheduleView,
        schedule: schedule

  "/ottelut/:id/:active?/:away?": (id, active, away) ->
    Q.spread [
      @store.fetch("schedule")
      @store.fetch("gameEvents", id: id)
      @store.fetch("gameLineups", id: id)
      @store.fetch("gameStats", id: id)
    ], (schedule, events, lineUps, stats) ->
      game = schedule.filter((g) ->
        g.id is id
      )[0] or {}

      title: "Ottelu - #{game.home} vs #{game.away}"
      component: React.createElement GameView,
        id: id
        game: game
        events: events
        lineUps: lineUps
        stats: stats
        active: active
        away: !!away

  "/sarjataulukko": ->
    @store.fetch("standings").then (standings) ->
      title: "Sarjataulukko"
      component: React.createElement StandingsView,
        standings: standings

  "/tilastot/:active?": (active) ->
    @store.fetch("stats").then (stats) ->
      title: "Tilastot"
      component: React.createElement StatsView,
        stats: stats
        active: active