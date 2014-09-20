Q = require 'q'
request = require 'request'

module.exports =
  environment: "server"

  fetch: (options) ->
    deferred = Q.defer()

    opts =
      url: options.url
      method: options.method or "GET"
      json: true

    opts.body if options.data

    request opts, (err, resp, body) ->
      if err
        deferred.reject(err)
        options.error(err) if options.error
      else
        deferred.resolve(body)
        options.success(body) if options.success

    deferred.promise