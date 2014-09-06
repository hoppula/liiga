TeamsCollection = require '../../collections/teams'

teamsCollection = new TeamsCollection([])
teamsCollection.fetched = teamsCollection.fetch(parse: false)

module.exports = teamsCollection