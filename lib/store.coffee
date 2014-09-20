Q = require 'q'

Store = (ajax) ->
  rootUrl: "http://192.168.11.6:4000/json/"

  data:
    team: {}

  get: (method, params...) ->
    # if running on server, do not cache requests
    if ajax.environment is "server"
      @[method](params)
    else
      # TODO: better caching
      if @data[method]
        if params.length isnt 0
          if @data[method][params[0]]
            Q(@data[method][params[0]])
          else
            @[method](params)
        else
          Q(@data[method])
      else
        @[method](params)

  teams: ->
    ajax.fetch(url: "#{@rootUrl}teams.json").then (teams) =>
      @data.teams = teams

  team: (id) ->
    ajax.fetch(url: "#{@rootUrl}#{id}.json").then (team) =>
      @data.team[id] = team

  stats: ->
    ajax.fetch(url: "#{@rootUrl}stats.json").then (stats) =>
      @data.stats = stats

module.exports = Store