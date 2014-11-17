Teams =
  namesAndIds:
    "Ässät": "assat"
    "Blues": "blues"
    "HIFK": "hifk"
    "HPK": "hpk"
    "Ilves": "ilves"
    "Sport": "sport"
    "JYP": "jyp"
    "KalPa": "kalpa"
    "Kärpät": "karpat"
    "Lukko": "lukko"
    "Pelicans": "pelicans"
    "SaiPa": "saipa"
    "Tappara": "tappara"
    "TPS": "tps"

  logo: (name) ->
    "/svg/#{@namesAndIds[name]}.svg"

  idToName: (id) ->
    ids = Object.keys(@namesAndIds).reduce (obj, name) =>
      obj[@namesAndIds[name]] = name
      obj
    , {}
    ids[id]

  nameToId: (name) ->
    @namesAndIds[name]

module.exports = Teams