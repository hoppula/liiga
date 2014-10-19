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
    "../svg/#{@namesAndIds[name]}.svg"

module.exports = Teams