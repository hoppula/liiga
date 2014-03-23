React = require 'react'
TeamsListView = require './views/teams_list'
TeamView = require './views/team'
teamsCollection = require './instances/collections/teams'

module.exports =

  "/": ->
    teamsCollection.fetched.then ->
      title: "Etusivu"
      component: TeamsListView(teams: teamsCollection)

  "/joukkueet/:id": (id) ->
    teamsCollection.fetched.then ->
      title: "Joukkueet - #{id}"
      component: TeamView(team: teamsCollection.get(id))