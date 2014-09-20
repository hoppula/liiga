React = require 'react/addons'
Q = require 'q'

IndexView = require './views/index'
TeamView = require './views/team'
PlayerView = require './views/player'

module.exports = (ajax) ->
  Store = require("./lib/store")(ajax)

  "/": ->
    # TODO: when required stores for front page are loaded,
    # start loading other frequently accessed stores
    # in background, so they're in cache when needed
    Q.spread([Store.get("teams"), Store.get("stats")], (teamsList, statsList) ->
      title: "Etusivu"
      component: IndexView(teams: teamsList, stats: statsList)
    )

  "/joukkueet/:id": (id) ->
    Q.spread([Store.get("teams"), Store.get("team", id)], (teamsList, team) ->
      title: "Joukkueet - #{id}"
      component: TeamView(id: id, teams: teamsList, team: team)
    )

  "/joukkueet/:id/:pid/:slug": (id, pid) ->
    Store.get("team", id).then (team) ->
      title: "Pelaajat - #{pid}"
      component: PlayerView(id: pid, teamId: id, team: team)

  "/ottelut/:id": (id) ->
    Store.get("match", id).then (match) ->
      title: "Ottelu - #{id}"
      component: MatchView(id: id, match: match)