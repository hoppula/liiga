Q = require 'q'

IndexView = require './views/index'
TeamView = require './views/team'
PlayerView = require './views/player'

module.exports =
  "/": ->
    Q.spread([@store.fetch("teams"), @store.fetch("stats")], (teamsList, statsList) ->
      title: "Etusivu"
      component: IndexView(teams: teamsList.toJSON(), stats: statsList.toJSON())
    )

  "/joukkueet/:id": (id) ->
    Q.spread([@store.fetch("teams"), @store.fetch("team", id: id)], (teamsList, team) ->
      title: "Joukkueet - #{id}"
      component: TeamView(id: id, teams: teamsList.toJSON(), team: team.toJSON())
    )

  "/joukkueet/:id/:pid/:slug": (id, pid) ->
    @store.fetch("team", id: id).then (team) ->
      title: "Pelaajat - #{pid}"
      component: PlayerView(id: pid, teamId: id, team: team.toJSON())

  "/ottelut/:id": (id) ->
    @store.fetch("match", id: id).then (match) ->
      title: "Ottelu - #{id}"
      component: MatchView(id: id, match: match.toJSON())