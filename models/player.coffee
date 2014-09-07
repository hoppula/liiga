#Backbone = require 'backbone'

# {@number, @nationality, @position, @birthPlace, @height,
# @weight, @shoots, @birthday, @firstName, @lastName, @rookie}

PlayerModel = Backbone.Model.extend

  age: ->
    today = new Date()
    birthday = @get "birthday" # parse as date?
    [year, month, day] = [today.getFullYear(), today.getMonth(), today.getDate()]
    age = year - birthday.getFullYear()

    monthPassed = (month - birthday.getMonth()) >= 0
    if not monthPassed or (monthPassed and day < birthday.getDate())
      age--

    age

  shootsAsText: ->
    if @get("shoots") is 'L' then 'Vasen' else 'Oikea'

  country: ->
    #config.countries[@nationality]

module.exports = PlayerModel