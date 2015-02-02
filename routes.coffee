Q = require 'q'
React = require 'react/addons'

IndexView = React.createFactory require('./views/index')
TeamView = React.createFactory require('./views/team')
PlayerView = React.createFactory require('./views/player')
GameView = React.createFactory require('./views/game')
ScheduleView = React.createFactory require('./views/schedule')
StandingsView = React.createFactory require('./views/standings')
StatsView = React.createFactory require('./views/stats')

module.exports =
  "/": ->
    Q.spread [
      @store.fetch("standings")
      @store.fetch("schedule")
      @store.fetch("teams")
    ], (standings, schedule, teamsList) ->
      title: "Etusivu"
      component: IndexView
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
      component: TeamView
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
      component: PlayerView
        id: pid
        player: player
        team: team

  "/ottelut": ->
    @store.fetch("schedule").then (schedule) ->
      title: "Otteluohjelma"
      component: ScheduleView
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
      component: GameView
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
      component: StandingsView
        standings: standings

  "/tilastot/:active?": (active) ->
    @store.fetch("stats").then (stats) ->
      title: "Tilastot"
      component: StatsView
        stats: stats
        active: active