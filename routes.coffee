Q = require 'q'

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
      @store.fetch("teams")
      @store.fetch("stats")
    ], (standings, teamsList, statsList) ->
      title: "Etusivu"
      component: IndexView
        standings: standings.toJSON()
        teams: teamsList.toJSON()
        stats: statsList.toJSON()

  "/joukkueet/:id/:active?": (id, active) ->
    Q.spread [
      @store.fetch("standings")
      @store.fetch("team", id: id)
    ], (standings, team) ->

      subTitle = switch active
        when "pelaajat" then "Pelaajat"
        when "tilastot" then "Tilastot"
        else "Otteluohjelma"

      title: "Joukkueet - #{team.get("info").name} - #{subTitle}"
      component: TeamView
        id: id
        standings: standings.toJSON()
        team: team.toJSON()
        active: active

  "/joukkueet/:id/:pid/:slug": (id, pid, slug) ->
    @store.fetch("team", id: id).then (team) ->
      player = team.get("roster").filter((player) ->
        player.id is "#{pid}/#{slug}"
      )[0]
      title: "Pelaajat - #{player.firstName} #{player.lastName}"
      component: PlayerView
        id: pid
        player: player
        team: team.toJSON()

  "/ottelut": ->
    @store.fetch("schedule").then (schedule) ->
      title: "Otteluohjelma"
      component: ScheduleView
        schedule: schedule.toJSON()

  "/ottelut/:id/:active?": (id, active) ->
    Q.spread [
      @store.fetch("schedule")
      @store.fetch("gameEvents", id: id)
      @store.fetch("gameLineups", id: id)
      @store.fetch("gameStats", id: id)
    ], (schedule, events, lineUps, stats) ->
      game = schedule.find (g) ->
        g.id is id

      title: "Ottelu - #{game.get("home")} vs #{game.get("away")}"
      component: GameView
        id: id
        game: game.toJSON()
        events: events.toJSON()
        lineUps: lineUps.toJSON()
        stats: stats.toJSON()
        active: active

  "/sarjataulukko": ->
    @store.fetch("standings").then (standings) ->
      title: "Sarjataulukko"
      component: StandingsView
        standings: standings.toJSON()

  "/tilastot/:active?": (active) ->
    @store.fetch("stats").then (stats) ->
      title: "Tilastot"
      component: StatsView
        stats: stats.toJSON()
        active: active