React = require 'react'
Q = require 'q'

TeamsListView = require './views/teams_list'
TeamView = require './views/team'

module.exports = (ajax) ->

  teams = ajax(url: "http://192.168.11.6:4000/json/teams.json")

  team = (id) ->
    ajax(url: "http://192.168.11.6:4000/json/#{id}.json")

  stats = ajax(url: "http://192.168.11.6:4000/json/stats.json")

  "/": ->
    Q.spread([teams, stats], (teamsList, statsList) ->
      title: "Etusivu"
      component: TeamsListView(teams: teamsList, stats: statsList)
    )

  "/joukkueet/:id": (id) ->
    team(id).then (team) ->
      title: "Joukkueet - #{id}"
      component: TeamView(team: team)