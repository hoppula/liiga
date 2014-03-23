TeamsCollection = require '../../collections/teams'

teamsCollection = new TeamsCollection([])
teamsCollection.fetched = teamsCollection.fetch()

module.exports = teamsCollection