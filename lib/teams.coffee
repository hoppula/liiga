Teams =
  namesAndIds:
    "Ässät": "assat"
    "HIFK": "hifk"
    "HPK": "hpk"
    "Ilves": "ilves"
    "Sport": "sport"
    "Jukurit": "jukurit"
    "JYP": "jyp"
    "KalPa": "kalpa"
    "KooKoo": "kookoo"
    "Kärpät": "karpat"
    "Lukko": "lukko"
    "Pelicans": "pelicans"
    "SaiPa": "saipa"
    "Tappara": "tappara"
    "TPS": "tps"

  logo: (name) ->
    "/assets/svg/#{@namesAndIds[name]}.svg"

  idToName: (id) ->
    ids = Object.keys(@namesAndIds).reduce (obj, name) =>
      obj[@namesAndIds[name]] = name
      obj
    , {}
    ids[id]

  nameToId: (name) ->
    @namesAndIds[name]

module.exports = Teams
