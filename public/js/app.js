(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hoppula/repos/liiga_frontend/client.coffee":[function(require,module,exports){
var React, app, appContainer, cerebellum, options;

React = require('react/addons');

cerebellum = require('cerebellum');

options = require('./options');

appContainer = document.getElementById(options.appId);

options.render = function(options) {
  if (options == null) {
    options = {};
  }
  window.scrollTo(0, 0);
  document.getElementsByTagName("title")[0].innerHTML = options.title;
  return React.renderComponent(options.component, appContainer);
};

options.initialize = function(client) {
  return React.initializeTouchEvents(true);
};

app = cerebellum.client(options);



},{"./options":"/Users/hoppula/repos/liiga_frontend/options.coffee","cerebellum":"cerebellum","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee":[function(require,module,exports){
module.exports = {
  url: document.location.origin
};



},{}],"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee":[function(require,module,exports){
var Teams;

Teams = {
  namesAndIds: {
    "Ässät": "assat",
    "Blues": "blues",
    "HIFK": "hifk",
    "HPK": "hpk",
    "Ilves": "ilves",
    "Sport": "sport",
    "JYP": "jyp",
    "KalPa": "kalpa",
    "Kärpät": "karpat",
    "Lukko": "lukko",
    "Pelicans": "pelicans",
    "SaiPa": "saipa",
    "Tappara": "tappara",
    "TPS": "tps"
  },
  logo: function(name) {
    return "../svg/" + this.namesAndIds[name] + ".svg";
  }
};

module.exports = Teams;



},{}],"/Users/hoppula/repos/liiga_frontend/options.coffee":[function(require,module,exports){
(function (__dirname){
var routes, stores;

stores = require('./stores');

routes = require('./routes');

module.exports = {
  staticFiles: __dirname + "/public",
  storeId: "store_state_from_server",
  appId: "app",
  routes: routes,
  stores: stores
};



}).call(this,"/")
},{"./routes":"/Users/hoppula/repos/liiga_frontend/routes.coffee","./stores":"/Users/hoppula/repos/liiga_frontend/stores.coffee"}],"/Users/hoppula/repos/liiga_frontend/routes.coffee":[function(require,module,exports){
var IndexView, PlayerView, Q, TeamView;

Q = require('q');

IndexView = require('./views/index');

TeamView = require('./views/team');

PlayerView = require('./views/player');

module.exports = {
  "/": function() {
    return Q.spread([this.store.fetch("teams"), this.store.fetch("stats")], function(teamsList, statsList) {
      return {
        title: "Etusivu",
        component: IndexView({
          teams: teamsList.toJSON(),
          stats: statsList.toJSON()
        })
      };
    });
  },
  "/joukkueet/:id": function(id) {
    return Q.spread([
      this.store.fetch("teams"), this.store.fetch("team", {
        id: id
      })
    ], function(teamsList, team) {
      return {
        title: "Joukkueet - " + id,
        component: TeamView({
          id: id,
          teams: teamsList.toJSON(),
          team: team.toJSON()
        })
      };
    });
  },
  "/joukkueet/:id/:pid/:slug": function(id, pid) {
    return this.store.fetch("team", {
      id: id
    }).then(function(team) {
      return {
        title: "Pelaajat - " + pid,
        component: PlayerView({
          id: pid,
          teamId: id,
          team: team.toJSON()
        })
      };
    });
  },
  "/ottelut/:id": function(id) {
    return this.store.fetch("match", {
      id: id
    }).then(function(match) {
      return {
        title: "Ottelu - " + id,
        component: MatchView({
          id: id,
          match: match.toJSON()
        })
      };
    });
  }
};



},{"./views/index":"/Users/hoppula/repos/liiga_frontend/views/index.coffee","./views/player":"/Users/hoppula/repos/liiga_frontend/views/player.coffee","./views/team":"/Users/hoppula/repos/liiga_frontend/views/team.coffee","q":"q"}],"/Users/hoppula/repos/liiga_frontend/stores.coffee":[function(require,module,exports){
var MatchModel, StatsModel, TeamModel, TeamsCollection;

TeamsCollection = require('./stores/teams');

StatsModel = require('./stores/stats');

TeamModel = require('./stores/team');

MatchModel = require('./stores/match');

module.exports = {
  teams: TeamsCollection,
  stats: StatsModel,
  team: TeamModel,
  match: MatchModel
};



},{"./stores/match":"/Users/hoppula/repos/liiga_frontend/stores/match.coffee","./stores/stats":"/Users/hoppula/repos/liiga_frontend/stores/stats.coffee","./stores/team":"/Users/hoppula/repos/liiga_frontend/stores/team.coffee","./stores/teams":"/Users/hoppula/repos/liiga_frontend/stores/teams.coffee"}],"/Users/hoppula/repos/liiga_frontend/stores/match.coffee":[function(require,module,exports){
var Match, Model, apiConfig;

Model = require('cerebellum').exoskeleton.Model;

apiConfig = require('../config/api');

Match = Model.extend({
  cacheKey: function() {
    return "matches/" + this.storeOptions.id;
  },
  url: function() {
    return "" + apiConfig.url + "/json/matches/" + this.storeOptions.id + ".json";
  }
});

module.exports = Match;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/stats.coffee":[function(require,module,exports){
var Model, Stats, apiConfig;

Model = require('cerebellum').exoskeleton.Model;

apiConfig = require('../config/api');

Stats = Model.extend({
  cacheKey: function() {
    return "stats";
  },
  url: "" + apiConfig.url + "/json/stats.json"
});

module.exports = Stats;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/team.coffee":[function(require,module,exports){
var Model, Team, apiConfig;

Model = require('cerebellum').exoskeleton.Model;

apiConfig = require('../config/api');

Team = Model.extend({
  cacheKey: function() {
    return "teams/" + this.storeOptions.id;
  },
  url: function() {
    return "" + apiConfig.url + "/json/teams/" + this.storeOptions.id + ".json";
  }
});

module.exports = Team;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/stores/teams.coffee":[function(require,module,exports){
var Collection, Teams, apiConfig;

Collection = require('cerebellum').exoskeleton.Collection;

apiConfig = require('../config/api');

Teams = Collection.extend({
  cacheKey: function() {
    return "teams";
  },
  url: "" + apiConfig.url + "/json/teams.json"
});

module.exports = Teams;



},{"../config/api":"/Users/hoppula/repos/liiga_frontend/config/api-browser.coffee","cerebellum":"cerebellum"}],"/Users/hoppula/repos/liiga_frontend/views/components/dropdown.coffee":[function(require,module,exports){
var Dropdown, React, classSet;

React = require('react/addons');

classSet = React.addons.classSet;

Dropdown = React.createClass({
  getInitialState: function() {
    return {
      open: false
    };
  },
  toggleOpen: function(event) {
    event.preventDefault();
    return this.setState({
      open: !this.state.open
    });
  },
  close: function(event) {
    return this.setState({
      open: false
    });
  },
  render: function() {
    var classes;
    classes = classSet({
      'open': this.state.open,
      'dropdown': true
    });
    return React.DOM.li({
      "className": classes
    }, React.DOM.a({
      "role": "button",
      "href": "#",
      "onClick": this.toggleOpen
    }, this.props.title, " ", React.DOM.span({
      "className": "caret"
    })), React.DOM.ul({
      "className": "dropdown-menu",
      "role": "menu"
    }, this.props.items.map((function(_this) {
      return function(item) {
        return React.DOM.li({
          "role": "presentation",
          "key": item.title
        }, React.DOM.a({
          "role": "menuitem",
          "tabIndex": "-1",
          "href": item.url,
          "onClick": _this.close
        }, item.title));
      };
    })(this))));
  }
});

module.exports = Dropdown;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/index.coffee":[function(require,module,exports){
var Index, Navigation, React, TeamsListView;

React = require('react/addons');

Navigation = require('./navigation');

TeamsListView = require('./teams_list');

Index = React.createClass({
  render: function() {
    return React.DOM.div(null, Navigation(null), React.DOM.div({
      "className": "jumbotron"
    }, React.DOM.h1(null, "Liiga.pw"), React.DOM.p(null, "Kaikki Liigasta nopeasti ja vaivattomasti")), TeamsListView({
      "teams": this.props.teams,
      "stats": this.props.stats
    }));
  }
});

module.exports = Index;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./teams_list":"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee":[function(require,module,exports){
var Dropdown, DropdownButton, MenuItem, Nav, NavItem, Navbar, Navigation, React, _ref;

React = require('react/addons');

Dropdown = require('./components/dropdown');

_ref = require("react-bootstrap"), Navbar = _ref.Navbar, Nav = _ref.Nav, NavItem = _ref.NavItem, DropdownButton = _ref.DropdownButton, MenuItem = _ref.MenuItem;

Navigation = React.createClass({
  render: function() {
    var brand, dropdown, team;
    brand = React.DOM.a({
      "href": "/",
      "className": "navbar-brand"
    }, "Liiga");
    if (this.props.team) {
      console.log("team", this.props.team);
      team = NavItem({
        "href": this.props.team.info.url
      }, this.props.team.info.name);
    }
    if (this.props.dropdown) {
      dropdown = DropdownButton({
        "title": this.props.dropdown.title,
        "onSelect": (function() {})
      }, this.props.dropdown.items.map(function(item) {
        return MenuItem({
          "key": item.title,
          "href": item.url
        }, item.title);
      }));
    }
    return Navbar({
      "brand": brand,
      "fixedTop": true,
      "toggleNavKey": 0.
    }, Nav({
      "className": "bs-navbar-collapse",
      "key": 0.,
      "role": "navigation"
    }, team, dropdown));
  }
});

module.exports = Navigation;



},{"./components/dropdown":"/Users/hoppula/repos/liiga_frontend/views/components/dropdown.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player.coffee":[function(require,module,exports){
var Navigation, Player, React;

React = require('react/addons');

Navigation = require('./navigation');

Player = React.createClass({
  render: function() {
    var player, players, roster, teamId;
    teamId = this.props.teamId;
    roster = this.props.team.roster;
    players = {
      title: "Pelaajat",
      items: roster.map((function(_this) {
        return function(player) {
          return {
            title: "" + player.firstName + " " + player.lastName,
            url: "/joukkueet/" + teamId + "/" + player.id
          };
        };
      })(this))
    };
    player = this.props.team.roster.filter((function(_this) {
      return function(player) {
        var id, slug, _ref;
        _ref = player.id.split("/"), id = _ref[0], slug = _ref[1];
        return id === _this.props.id;
      };
    })(this))[0];
    console.log("player", player);
    return React.DOM.div(null, Navigation({
      "dropdown": players,
      "team": this.props.team
    }), React.DOM.h1(null, player.firstName, " ", player.lastName));
  }
});

module.exports = Player;



},{"./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee":[function(require,module,exports){
var PlayerStats, React;

React = require('react/addons');

PlayerStats = React.createClass({
  render: function() {
    return React.DOM.table({
      "className": "table table-striped"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Name"), React.DOM.th(null, "Games"), React.DOM.th(null, "Goals"), React.DOM.th(null, "Assists"), React.DOM.th(null, "Points"), React.DOM.th(null, "Penalties"), React.DOM.th(null, "+\x2F-"))), this.props.stats.map(function(player) {
      return React.DOM.tr({
        "key": player.id
      }, React.DOM.td(null, React.DOM.a({
        "href": "/joukkueet"
      }, player.firstName, " \x3E", player.lastName)), React.DOM.td(null, player.games), React.DOM.td(null, player.goals), React.DOM.td(null, player.assists), React.DOM.td(null, player.points), React.DOM.td(null, player.penalties), React.DOM.td(null, player.plusMinus));
    }));
  }
});

module.exports = PlayerStats;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team.coffee":[function(require,module,exports){
var Button, ButtonToolbar, Col, Jumbotron, Navigation, PlayerStats, React, Row, TabPane, TabbedArea, Team, TeamRoster, TeamSchedule, Teams, _ref;

React = require('react/addons');

PlayerStats = require('./player_stats');

TeamSchedule = require('./team_schedule');

TeamRoster = require('./team_roster');

Navigation = require('./navigation');

Teams = require('../lib/teams');

_ref = require("react-bootstrap"), TabbedArea = _ref.TabbedArea, TabPane = _ref.TabPane, Jumbotron = _ref.Jumbotron, ButtonToolbar = _ref.ButtonToolbar, Button = _ref.Button, Col = _ref.Col, Row = _ref.Row;

Team = React.createClass({
  logo: function() {
    return React.DOM.img({
      "src": Teams.logo(this.props.team.info.name),
      "alt": this.props.team.info.name
    });
  },
  render: function() {
    var teams;
    teams = {
      title: "Joukkueet",
      items: this.props.teams.map(function(team) {
        return {
          title: team.name,
          url: team.url
        };
      })
    };
    return React.DOM.div(null, Navigation({
      "dropdown": teams
    }), React.DOM.div({
      "className": "team"
    }, Jumbotron(null, Row(null, Col({
      "xs": 12.,
      "md": 6.
    }, React.DOM.h1(null, this.logo(), " ", this.props.team.info.name)), Col({
      "xs": 12.,
      "md": 6.
    }, React.DOM.div({
      "className": "team-container"
    }, React.DOM.ul(null, React.DOM.li(null, this.props.team.info.longName), React.DOM.li(null, this.props.team.info.address), React.DOM.li(null, this.props.team.info.email)), ButtonToolbar(null, Button({
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.ticketsUrl
    }, "Liput"), Button({
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.locationUrl
    }, "Hallin sijainti")))))), TabbedArea({
      "defaultActiveKey": 1.,
      "animation": false
    }, TabPane({
      "key": 1.,
      "tab": "Ottelut"
    }, React.DOM.h1(null, "Ottelut"), TeamSchedule({
      "team": this.props.team
    })), TabPane({
      "key": 2.,
      "tab": "Pelaajat"
    }, React.DOM.h1(null, "Pelaajat"), TeamRoster({
      "teamId": this.props.id,
      "roster": this.props.team.roster
    })))));
  }
});

module.exports = Team;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./player_stats":"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee","./team_roster":"/Users/hoppula/repos/liiga_frontend/views/team_roster.coffee","./team_schedule":"/Users/hoppula/repos/liiga_frontend/views/team_schedule.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_item.coffee":[function(require,module,exports){
var React, TeamItem;

React = require('react/addons');

TeamItem = React.createClass({
  render: function() {
    return React.DOM.a({
      "className": "team " + this.props.team.id + " btn btn-default btn-lg btn-block",
      "href": "/joukkueet/" + this.props.team.id
    }, this.props.team.name);
  }
});

module.exports = TeamItem;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_roster.coffee":[function(require,module,exports){
var React, TeamRoster, _;

React = require('react/addons');

_ = require('lodash');

TeamRoster = React.createClass({
  groupedRoster: function() {
    return _.chain(this.props.roster).groupBy(function(player) {
      return player.position;
    }).reduce(function(result, player, position) {
      var group;
      group = (function() {
        switch (false) {
          case !_.include(["KH", "OL", "VL"], position):
            return "Hyökkääjät";
          case !_.include(["OP", "VP"], position):
            return "Puolustajat";
          case position !== "MV":
            return "Maalivahdit";
        }
      })();
      result[group] || (result[group] = []);
      result[group].push(player);
      return result;
    }, {});
  },
  render: function() {
    var groups;
    groups = this.groupedRoster().map((function(_this) {
      return function(players, group) {
        return React.DOM.tbody(null, React.DOM.tr(null, React.DOM.th({
          "colSpan": 5
        }, group)), _.chain(players).flatten().map(function(player) {
          var title, url;
          url = "/joukkueet/" + _this.props.teamId + "/" + player.id;
          title = "" + player.firstName + " " + player.lastName;
          return React.DOM.tr({
            "key": player.id
          }, React.DOM.td(null, React.DOM.a({
            "href": url
          }, title)), React.DOM.td(null, React.DOM.strong(null, player.number)), React.DOM.td(null, player.height), React.DOM.td(null, player.weight), React.DOM.td(null, player.shoots));
        }));
      };
    })(this));
    return React.DOM.table({
      "className": "table table-striped team-roster"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Nimi"), React.DOM.th(null, "Numero"), React.DOM.th(null, "Pituus"), React.DOM.th(null, "Paino"), React.DOM.th(null, "K\u00e4tisyys"))), groups);
  }
});

module.exports = TeamRoster;



},{"lodash":"lodash","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_schedule.coffee":[function(require,module,exports){
var React, TeamSchedule, Teams, moment, _;

React = require('react/addons');

moment = require('moment');

_ = require('lodash');

Teams = require('../lib/teams');

moment.locale('fi', {
  months: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"]
});

moment.locale('fi');

TeamSchedule = React.createClass({
  titleStyle: function(name) {
    if (this.props.team.info.name === name) {
      return React.DOM.strong(null, name);
    } else {
      return name;
    }
  },
  logo: function(name) {
    return React.DOM.img({
      "src": Teams.logo(name),
      "alt": name
    });
  },
  groupedSchedule: function() {
    return _.chain(this.props.team.schedule).groupBy(function(match) {
      return moment(match.date).format("YYYY-MM");
    });
  },
  render: function() {
    var monthlyMatches;
    monthlyMatches = this.groupedSchedule().map((function(_this) {
      return function(matches, month) {
        return React.DOM.tbody(null, React.DOM.tr(null, React.DOM.th({
          "colSpan": 4
        }, moment(month, "YYYY-MM").format("MMMM"))), matches.map(function(match) {
          return React.DOM.tr({
            "key": match.id
          }, React.DOM.td(null, moment(match.date).format("DD.MM.YYYY"), " ", match.time), React.DOM.td(null, React.DOM.a({
            "href": "/ottelut/" + match.id
          }, _this.titleStyle(match.home), " - ", _this.titleStyle(match.visitor))), React.DOM.td(null, match.homeScore, "-", match.visitorScore), React.DOM.td(null, match.attendance));
        }));
      };
    })(this));
    return React.DOM.table({
      "className": "table table-striped team-schedule"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "P\u00e4iv\u00e4m\u00e4\u00e4r\u00e4"), React.DOM.th(null, "Joukkueet"), React.DOM.th(null, "Tulos"), React.DOM.th(null, "Yleis\u00f6m\u00e4\u00e4r\u00e4"))), monthlyMatches);
  }
});

module.exports = TeamSchedule;



},{"../lib/teams":"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee","lodash":"lodash","moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee":[function(require,module,exports){
var React, TeamItem, TeamsList, TopScorers;

React = require('react/addons');

TeamItem = require('./team_item');

TopScorers = require('./top_scorers');

TeamsList = React.createClass({
  render: function() {
    return React.DOM.div({
      "className": "row"
    }, React.DOM.div({
      "className": "teams_view col-xs-12 col-sm-6"
    }, this.props.teams.map(function(team) {
      return TeamItem({
        key: team.id,
        team: team
      });
    })), React.DOM.div({
      "className": "col-xs-12 col-sm-6"
    }, TopScorers({
      "stats": this.props.stats
    })));
  }
});

module.exports = TeamsList;



},{"./team_item":"/Users/hoppula/repos/liiga_frontend/views/team_item.coffee","./top_scorers":"/Users/hoppula/repos/liiga_frontend/views/top_scorers.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/top_scorers.coffee":[function(require,module,exports){
var React, TopScorers;

React = require('react/addons');

TopScorers = React.createClass({
  render: function() {
    return React.DOM.table({
      "className": "table table-striped"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Nimi"), React.DOM.th(null, "Ottelut"), React.DOM.th(null, "Maalit"), React.DOM.th(null, "Sy\u00f6t\u00f6t"), React.DOM.th(null, "Pisteet"))), this.props.stats.scoringStats.filter(function(player, index) {
      return index < 20;
    }).map(function(player) {
      return React.DOM.tr({
        "key": player.id
      }, React.DOM.td(null, player.firstName, " ", player.lastName), React.DOM.td(null, player.games), React.DOM.td(null, player.goals), React.DOM.td(null, player.assists), React.DOM.td(null, player.points));
    }));
  }
});

module.exports = TopScorers;



},{"react/addons":"react/addons"}]},{},["/Users/hoppula/repos/liiga_frontend/client.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9jbGllbnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY29uZmlnL2FwaS1icm93c2VyLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2xpYi90ZWFtcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9vcHRpb25zLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3JvdXRlcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvc3RvcmVzL21hdGNoLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3N0b3Jlcy9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9zdG9yZXMvdGVhbXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvY29tcG9uZW50cy9kcm9wZG93bi5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9uYXZpZ2F0aW9uLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3BsYXllci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXJfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX2l0ZW0uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9yb3N0ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtc19saXN0LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RvcF9zY29yZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsNkNBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBQVIsQ0FBQTs7QUFBQSxVQUNBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FEYixDQUFBOztBQUFBLE9BRUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUZWLENBQUE7O0FBQUEsWUFJQSxHQUFlLFFBQVEsQ0FBQyxjQUFULENBQXdCLE9BQU8sQ0FBQyxLQUFoQyxDQUpmLENBQUE7O0FBQUEsT0FNTyxDQUFDLE1BQVIsR0FBaUIsU0FBQyxPQUFELEdBQUE7O0lBQUMsVUFBUTtHQUN4QjtBQUFBLEVBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEIsRUFBa0IsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsRUFDQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsT0FBOUIsQ0FBdUMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUExQyxHQUFzRCxPQUFPLENBQUMs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QSxDQUZKLENBVkgsRUFETTtFQUFBLENBQVI7Q0FGVyxDQUZiLENBQUE7O0FBQUEsTUE0Qk0sQ0FBQyxPQUFQLEdBQWlCLFVBNUJqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuY2VyZWJlbGx1bSA9IHJlcXVpcmUgJ2NlcmViZWxsdW0nXG5vcHRpb25zID0gcmVxdWlyZSAnLi9vcHRpb25zJ1xuXG5hcHBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb25zLmFwcElkKVxuXG5vcHRpb25zLnJlbmRlciA9IChvcHRpb25zPXt9KSAtPlxuICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRpdGxlXCIpWzBdLmlubmVySFRNTCA9IG9wdGlvbnMudGl0bGVcbiAgUmVhY3QucmVuZGVyQ29tcG9uZW50KG9wdGlvbnMuY29tcG9uZW50LCBhcHBDb250YWluZXIpXG5cbm9wdGlvbnMuaW5pdGlhbGl6ZSA9IChjbGllbnQpIC0+XG4gIFJlYWN0LmluaXRpYWxpemVUb3VjaEV2ZW50cyh0cnVlKVxuXG5hcHAgPSBjZXJlYmVsbHVtLmNsaWVudChvcHRpb25zKSIsIm1vZHVsZS5leHBvcnRzID1cbiAgdXJsOiBkb2N1bWVudC5sb2NhdGlvbi5vcmlnaW4iLCJUZWFtcyA9XG4gIG5hbWVzQW5kSWRzOlxuICAgIFwiw4Rzc8OkdFwiOiBcImFzc2F0XCJcbiAgICBcIkJsdWVzXCI6IFwiYmx1ZXNcIlxuICAgIFwiSElGS1wiOiBcImhpZmtcIlxuICAgIFwiSFBLXCI6IFwiaHBrXCJcbiAgICBcIklsdmVzXCI6IFwiaWx2ZXNcIlxuICAgIFwiU3BvcnRcIjogXCJzcG9ydFwiXG4gICAgXCJKWVBcIjogXCJqeXBcIlxuICAgIFwiS2FsUGFcIjogXCJrYWxwYVwiXG4gICAgXCJLw6RycMOkdFwiOiBcImthcnBhdFwiXG4gICAgXCJMdWtrb1wiOiBcImx1a2tvXCJcbiAgICBcIlBlbGljYW5zXCI6IFwicGVsaWNhbnNcIlxuICAgIFwiU2FpUGFcIjogXCJzYWlwYVwiXG4gICAgXCJUYXBwYXJhXCI6IFwidGFwcGFyYVwiXG4gICAgXCJUUFNcIjogXCJ0cHNcIlxuXG4gIGxvZ286IChuYW1lKSAtPlxuICAgIFwiLi4vc3ZnLyN7QG5hbWVzQW5kSWRzW25hbWVdfS5zdmdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1zIiwic3RvcmVzID0gcmVxdWlyZSAnLi9zdG9yZXMnXG5yb3V0ZXMgPSByZXF1aXJlICcuL3JvdXRlcydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzdGF0aWNGaWxlczogX19kaXJuYW1lK1wiL3B1YmxpY1wiXG4gIHN0b3JlSWQ6IFwic3RvcmVfc3RhdGVfZnJvbV9zZXJ2ZXJcIlxuICBhcHBJZDogXCJhcHBcIlxuICByb3V0ZXM6IHJvdXRlc1xuICBzdG9yZXM6IHN0b3JlcyIsIlEgPSByZXF1aXJlICdxJ1xuXG5JbmRleFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2luZGV4J1xuVGVhbVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3RlYW0nXG5QbGF5ZXJWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9wbGF5ZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgXCIvXCI6IC0+XG4gICAgUS5zcHJlYWQoW0BzdG9yZS5mZXRjaChcInRlYW1zXCIpLCBAc3RvcmUuZmV0Y2goXCJzdGF0c1wiKV0sICh0ZWFtc0xpc3QsIHN0YXRzTGlzdCkgLT5cbiAgICAgIHRpdGxlOiBcIkV0dXNpdnVcIlxuICAgICAgY29tcG9uZW50OiBJbmRleFZpZXcodGVhbXM6IHRlYW1zTGlzdC50b0pTT04oKSwgc3RhdHM6IHN0YXRzTGlzdC50b0pTT04oKSlcbiAgICApXG5cbiAgXCIvam91a2t1ZWV0LzppZFwiOiAoaWQpIC0+XG4gICAgUS5zcHJlYWQoW0BzdG9yZS5mZXRjaChcInRlYW1zXCIpLCBAc3RvcmUuZmV0Y2goXCJ0ZWFtXCIsIGlkOiBpZCldLCAodGVhbXNMaXN0LCB0ZWFtKSAtPlxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0IC0gI3tpZH1cIlxuICAgICAgY29tcG9uZW50OiBUZWFtVmlldyhpZDogaWQsIHRlYW1zOiB0ZWFtc0xpc3QudG9KU09OKCksIHRlYW06IHRlYW0udG9KU09OKCkpXG4gICAgKVxuXG4gIFwiL2pvdWtrdWVldC86aWQvOnBpZC86c2x1Z1wiOiAoaWQsIHBpZCkgLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJ0ZWFtXCIsIGlkOiBpZCkudGhlbiAodGVhbSkgLT5cbiAgICAgIHRpdGxlOiBcIlBlbGFhamF0IC0gI3twaWR9XCJcbiAgICAgIGNvbXBvbmVudDogUGxheWVyVmlldyhpZDogcGlkLCB0ZWFtSWQ6IGlkLCB0ZWFtOiB0ZWFtLnRvSlNPTigpKVxuXG4gIFwiL290dGVsdXQvOmlkXCI6IChpZCkgLT5cbiAgICBAc3RvcmUuZmV0Y2goXCJtYXRjaFwiLCBpZDogaWQpLnRoZW4gKG1hdGNoKSAtPlxuICAgICAgdGl0bGU6IFwiT3R0ZWx1IC0gI3tpZH1cIlxuICAgICAgY29tcG9uZW50OiBNYXRjaFZpZXcoaWQ6IGlkLCBtYXRjaDogbWF0Y2gudG9KU09OKCkpIiwiVGVhbXNDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi9zdG9yZXMvdGVhbXMnXG5TdGF0c01vZGVsID0gcmVxdWlyZSAnLi9zdG9yZXMvc3RhdHMnXG5UZWFtTW9kZWwgPSByZXF1aXJlICcuL3N0b3Jlcy90ZWFtJ1xuTWF0Y2hNb2RlbCA9IHJlcXVpcmUgJy4vc3RvcmVzL21hdGNoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHRlYW1zOiBUZWFtc0NvbGxlY3Rpb25cbiAgc3RhdHM6IFN0YXRzTW9kZWxcbiAgdGVhbTogVGVhbU1vZGVsXG4gIG1hdGNoOiBNYXRjaE1vZGVsIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuZXhvc2tlbGV0b24uTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cbk1hdGNoID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwibWF0Y2hlcy8je0BzdG9yZU9wdGlvbnMuaWR9XCJcblxuICB1cmw6IC0+XG4gICAgXCIje2FwaUNvbmZpZy51cmx9L2pzb24vbWF0Y2hlcy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoIiwiTW9kZWwgPSByZXF1aXJlKCdjZXJlYmVsbHVtJykuZXhvc2tlbGV0b24uTW9kZWxcbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblN0YXRzID0gTW9kZWwuZXh0ZW5kXG4gIGNhY2hlS2V5OiAtPlxuICAgIFwic3RhdHNcIlxuXG4gIHVybDogXCIje2FwaUNvbmZpZy51cmx9L2pzb24vc3RhdHMuanNvblwiXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdHMiLCJNb2RlbCA9IHJlcXVpcmUoJ2NlcmViZWxsdW0nKS5leG9za2VsZXRvbi5Nb2RlbFxuYXBpQ29uZmlnID0gcmVxdWlyZSAnLi4vY29uZmlnL2FwaSdcblxuVGVhbSA9IE1vZGVsLmV4dGVuZFxuICBjYWNoZUtleTogLT5cbiAgICBcInRlYW1zLyN7QHN0b3JlT3B0aW9ucy5pZH1cIlxuXG4gIHVybDogLT5cbiAgICBcIiN7YXBpQ29uZmlnLnVybH0vanNvbi90ZWFtcy8je0BzdG9yZU9wdGlvbnMuaWR9Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW0iLCJDb2xsZWN0aW9uID0gcmVxdWlyZSgnY2VyZWJlbGx1bScpLmV4b3NrZWxldG9uLkNvbGxlY3Rpb25cbmFwaUNvbmZpZyA9IHJlcXVpcmUgJy4uL2NvbmZpZy9hcGknXG5cblRlYW1zID0gQ29sbGVjdGlvbi5leHRlbmRcbiAgY2FjaGVLZXk6IC0+XG4gICAgXCJ0ZWFtc1wiXG5cbiAgdXJsOiBcIiN7YXBpQ29uZmlnLnVybH0vanNvbi90ZWFtcy5qc29uXCJcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtcyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuY2xhc3NTZXQgPSBSZWFjdC5hZGRvbnMuY2xhc3NTZXRcblxuRHJvcGRvd24gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBvcGVuOiBmYWxzZVxuXG4gIHRvZ2dsZU9wZW46IChldmVudCkgLT5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQHNldFN0YXRlIG9wZW46IG5vdCBAc3RhdGUub3BlblxuXG4gIGNsb3NlOiAoZXZlbnQpIC0+XG4gICAgQHNldFN0YXRlIG9wZW46IGZhbHNlXG5cbiAgcmVuZGVyOiAtPlxuICAgIGNsYXNzZXMgPSBjbGFzc1NldFxuICAgICAgJ29wZW4nOiBAc3RhdGUub3BlblxuICAgICAgJ2Ryb3Bkb3duJzogdHJ1ZVxuXG4gICAgUmVhY3QuRE9NLmxpKHtcImNsYXNzTmFtZVwiOiAoY2xhc3Nlcyl9LCBcbiAgICAgIFJlYWN0LkRPTS5hKHtcInJvbGVcIjogXCJidXR0b25cIiwgXCJocmVmXCI6IFwiI1wiLCBcIm9uQ2xpY2tcIjogKEB0b2dnbGVPcGVuKX0sIChAcHJvcHMudGl0bGUpLCBcIiBcIiwgUmVhY3QuRE9NLnNwYW4oe1wiY2xhc3NOYW1lXCI6IFwiY2FyZXRcIn0pKSwgXG4gICAgICBSZWFjdC5ET00udWwoe1wiY2xhc3NOYW1lXCI6IFwiZHJvcGRvd24tbWVudVwiLCBcInJvbGVcIjogXCJtZW51XCJ9LCBcbiAgICAgICAgKEBwcm9wcy5pdGVtcy5tYXAgKGl0ZW0pID0+XG4gICAgICAgICAgUmVhY3QuRE9NLmxpKHtcInJvbGVcIjogXCJwcmVzZW50YXRpb25cIiwgXCJrZXlcIjogKGl0ZW0udGl0bGUpfSwgXG4gICAgICAgICAgICBSZWFjdC5ET00uYSh7XCJyb2xlXCI6IFwibWVudWl0ZW1cIiwgXCJ0YWJJbmRleFwiOiBcIi0xXCIsIFwiaHJlZlwiOiAoaXRlbS51cmwpLCBcIm9uQ2xpY2tcIjogKEBjbG9zZSl9LCAoaXRlbS50aXRsZSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IERyb3Bkb3duIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGVhbXNMaXN0VmlldyA9IHJlcXVpcmUgJy4vdGVhbXNfbGlzdCdcblxuSW5kZXggPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgTmF2aWdhdGlvbihudWxsKSwgXG5cbiAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwianVtYm90cm9uXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIFwiTGlpZ2EucHdcIiksIFxuICAgICAgICBSZWFjdC5ET00ucChudWxsLCBcIkthaWtraSBMaWlnYXN0YSBub3BlYXN0aSBqYSB2YWl2YXR0b21hc3RpXCIpXG4gICAgICApLCBcblxuICAgICAgVGVhbXNMaXN0Vmlldyh7XCJ0ZWFtc1wiOiAoQHByb3BzLnRlYW1zKSwgXCJzdGF0c1wiOiAoQHByb3BzLnN0YXRzKX0pXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4IiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5Ecm9wZG93biA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy9kcm9wZG93bidcblxue05hdmJhciwgTmF2LCBOYXZJdGVtLCBEcm9wZG93bkJ1dHRvbiwgTWVudUl0ZW19ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cbk5hdmlnYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBicmFuZCA9IFJlYWN0LkRPTS5hKHtcImhyZWZcIjogXCIvXCIsIFwiY2xhc3NOYW1lXCI6IFwibmF2YmFyLWJyYW5kXCJ9LCBcIkxpaWdhXCIpXG5cbiAgICBpZiBAcHJvcHMudGVhbVxuICAgICAgY29uc29sZS5sb2cgXCJ0ZWFtXCIsIEBwcm9wcy50ZWFtXG4gICAgICB0ZWFtID0gTmF2SXRlbSh7XCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLnVybCl9LCAoQHByb3BzLnRlYW0uaW5mby5uYW1lKSlcblxuICAgIGlmIEBwcm9wcy5kcm9wZG93blxuICAgICAgZHJvcGRvd24gPSBEcm9wZG93bkJ1dHRvbih7XCJ0aXRsZVwiOiAoQHByb3BzLmRyb3Bkb3duLnRpdGxlKSwgXCJvblNlbGVjdFwiOiAoLT4pfSwgXG4gICAgICAgIChAcHJvcHMuZHJvcGRvd24uaXRlbXMubWFwIChpdGVtKSAtPlxuICAgICAgICAgIE1lbnVJdGVtKHtcImtleVwiOiAoaXRlbS50aXRsZSksIFwiaHJlZlwiOiAoaXRlbS51cmwpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBOYXZiYXIoe1wiYnJhbmRcIjogKGJyYW5kKSwgXCJmaXhlZFRvcFwiOiB0cnVlLCBcInRvZ2dsZU5hdktleVwiOiAoMCl9LCBcbiAgICAgIE5hdih7XCJjbGFzc05hbWVcIjogXCJicy1uYXZiYXItY29sbGFwc2VcIiwgXCJrZXlcIjogKDApLCBcInJvbGVcIjogXCJuYXZpZ2F0aW9uXCJ9LCBcbiAgICAgICAgKHRlYW0pLCBcbiAgICAgICAgKGRyb3Bkb3duKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBOYXZpZ2F0aW9uIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5cblBsYXllciA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIHRlYW1JZCA9IEBwcm9wcy50ZWFtSWRcbiAgICByb3N0ZXIgPSBAcHJvcHMudGVhbS5yb3N0ZXJcblxuICAgIHBsYXllcnMgPVxuICAgICAgdGl0bGU6IFwiUGVsYWFqYXRcIixcbiAgICAgIGl0ZW1zOiByb3N0ZXIubWFwIChwbGF5ZXIpID0+XG4gICAgICAgIHRpdGxlOiBcIiN7cGxheWVyLmZpcnN0TmFtZX0gI3twbGF5ZXIubGFzdE5hbWV9XCJcbiAgICAgICAgdXJsOiBcIi9qb3Vra3VlZXQvI3t0ZWFtSWR9LyN7cGxheWVyLmlkfVwiXG5cbiAgICBwbGF5ZXIgPSBAcHJvcHMudGVhbS5yb3N0ZXIuZmlsdGVyKChwbGF5ZXIpID0+XG4gICAgICBbaWQsIHNsdWddID0gcGxheWVyLmlkLnNwbGl0KFwiL1wiKVxuICAgICAgaWQgaXMgQHByb3BzLmlkXG4gICAgKVswXVxuXG4gICAgY29uc29sZS5sb2cgXCJwbGF5ZXJcIiwgcGxheWVyXG5cbiAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgTmF2aWdhdGlvbih7XCJkcm9wZG93blwiOiAocGxheWVycyksIFwidGVhbVwiOiAoQHByb3BzLnRlYW0pfSksIFxuXG4gICAgICBSZWFjdC5ET00uaDEobnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5QbGF5ZXJTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk5hbWVcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkdhbWVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJHb2Fsc1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiQXNzaXN0c1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUG9pbnRzXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQZW5hbHRpZXNcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIitcXHgyRi1cIilcbiAgICAgICAgKVxuICAgICAgKSwgXG4gICAgICAoQHByb3BzLnN0YXRzLm1hcCAocGxheWVyKSAtPlxuICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIFJlYWN0LkRPTS5hKHtcImhyZWZcIjogXCIvam91a2t1ZWV0XCJ9LCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFxceDNFXCIsIChwbGF5ZXIubGFzdE5hbWUpKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmdhbWVzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmdvYWxzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmFzc2lzdHMpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIucG9pbnRzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBlbmFsdGllcykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wbHVzTWludXMpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclN0YXRzIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5QbGF5ZXJTdGF0cyA9IHJlcXVpcmUgJy4vcGxheWVyX3N0YXRzJ1xuVGVhbVNjaGVkdWxlID0gcmVxdWlyZSAnLi90ZWFtX3NjaGVkdWxlJ1xuVGVhbVJvc3RlciA9IHJlcXVpcmUgJy4vdGVhbV9yb3N0ZXInXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbntUYWJiZWRBcmVhLCBUYWJQYW5lLCBKdW1ib3Ryb24sIEJ1dHRvblRvb2xiYXIsIEJ1dHRvbiwgQ29sLCBSb3d9ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGxvZ286IC0+XG4gICAgUmVhY3QuRE9NLmltZyh7XCJzcmNcIjogKFRlYW1zLmxvZ28oQHByb3BzLnRlYW0uaW5mby5uYW1lKSksIFwiYWx0XCI6IChAcHJvcHMudGVhbS5pbmZvLm5hbWUpfSlcblxuICByZW5kZXI6IC0+XG4gICAgdGVhbXMgPVxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0XCIsXG4gICAgICBpdGVtczogQHByb3BzLnRlYW1zLm1hcCAodGVhbSkgLT5cbiAgICAgICAgdGl0bGU6IHRlYW0ubmFtZVxuICAgICAgICB1cmw6IHRlYW0udXJsXG5cbiAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgTmF2aWdhdGlvbih7XCJkcm9wZG93blwiOiAodGVhbXMpfSksIFxuXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcInRlYW1cIn0sIFxuICAgICAgICBKdW1ib3Ryb24obnVsbCwgXG4gICAgICAgICAgUm93KG51bGwsIFxuICAgICAgICAgICAgQ29sKHtcInhzXCI6ICgxMiksIFwibWRcIjogKDYpfSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCAoQGxvZ28oKSksIFwiIFwiLCAoQHByb3BzLnRlYW0uaW5mby5uYW1lKSlcbiAgICAgICAgICAgICksIFxuICAgICAgICAgICAgQ29sKHtcInhzXCI6ICgxMiksIFwibWRcIjogKDYpfSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGVhbS1jb250YWluZXJcIn0sIFxuICAgICAgICAgICAgICAgIFJlYWN0LkRPTS51bChudWxsLCBcbiAgICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCAoQHByb3BzLnRlYW0uaW5mby5sb25nTmFtZSkpLCBcbiAgICAgICAgICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCAoQHByb3BzLnRlYW0uaW5mby5hZGRyZXNzKSksIFxuICAgICAgICAgICAgICAgICAgUmVhY3QuRE9NLmxpKG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmVtYWlsKSlcbiAgICAgICAgICAgICAgICApLCBcblxuICAgICAgICAgICAgICAgIEJ1dHRvblRvb2xiYXIobnVsbCwgXG4gICAgICAgICAgICAgICAgICBCdXR0b24oe1wiYnNTdHlsZVwiOiBcInByaW1hcnlcIiwgXCJic1NpemVcIjogXCJsYXJnZVwiLCBcImhyZWZcIjogKEBwcm9wcy50ZWFtLmluZm8udGlja2V0c1VybCl9LCBcIkxpcHV0XCIpLCBcbiAgICAgICAgICAgICAgICAgIEJ1dHRvbih7XCJic1N0eWxlXCI6IFwicHJpbWFyeVwiLCBcImJzU2l6ZVwiOiBcImxhcmdlXCIsIFwiaHJlZlwiOiAoQHByb3BzLnRlYW0uaW5mby5sb2NhdGlvblVybCl9LCBcIkhhbGxpbiBzaWphaW50aVwiKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG5cbiAgICAgICAgVGFiYmVkQXJlYSh7XCJkZWZhdWx0QWN0aXZlS2V5XCI6ICgxKSwgXCJhbmltYXRpb25cIjogKGZhbHNlKX0sIFxuICAgICAgICAgIFRhYlBhbmUoe1wia2V5XCI6ICgxKSwgXCJ0YWJcIjogXCJPdHRlbHV0XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIk90dGVsdXRcIiksIFxuICAgICAgICAgICAgVGVhbVNjaGVkdWxlKHtcInRlYW1cIjogKEBwcm9wcy50ZWFtKX0pXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgVGFiUGFuZSh7XCJrZXlcIjogKDIpLCBcInRhYlwiOiBcIlBlbGFhamF0XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIlBlbGFhamF0XCIpLCBcbiAgICAgICAgICAgIFRlYW1Sb3N0ZXIoe1widGVhbUlkXCI6IChAcHJvcHMuaWQpLCBcInJvc3RlclwiOiAoQHByb3BzLnRlYW0ucm9zdGVyKX0pXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW0iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVGVhbUl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00uYSh7XCJjbGFzc05hbWVcIjogXCJ0ZWFtICN7QHByb3BzLnRlYW0uaWR9IGJ0biBidG4tZGVmYXVsdCBidG4tbGcgYnRuLWJsb2NrXCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbS5pZH1cIn0sIFxuICAgICAgKEBwcm9wcy50ZWFtLm5hbWUpXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1JdGVtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5UZWFtUm9zdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBncm91cGVkUm9zdGVyOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnJvc3RlcilcbiAgICAuZ3JvdXBCeSgocGxheWVyKSAtPiBwbGF5ZXIucG9zaXRpb24pXG4gICAgLnJlZHVjZSgocmVzdWx0LCBwbGF5ZXIsIHBvc2l0aW9uKSAtPlxuICAgICAgZ3JvdXAgPSBzd2l0Y2hcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiS0hcIiwgXCJPTFwiLCBcIlZMXCJdLCBwb3NpdGlvbikgdGhlbiBcIkh5w7Zra8Okw6Rqw6R0XCJcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiT1BcIiwgXCJWUFwiXSwgcG9zaXRpb24pIHRoZW4gXCJQdW9sdXN0YWphdFwiXG4gICAgICAgIHdoZW4gcG9zaXRpb24gaXMgXCJNVlwiIHRoZW4gXCJNYWFsaXZhaGRpdFwiXG4gICAgICByZXN1bHRbZ3JvdXBdIHx8PSBbXVxuICAgICAgcmVzdWx0W2dyb3VwXS5wdXNoIHBsYXllclxuICAgICAgcmVzdWx0XG4gICAgLCB7fSlcblxuICByZW5kZXI6IC0+XG4gICAgZ3JvdXBzID0gQGdyb3VwZWRSb3N0ZXIoKS5tYXAgKHBsYXllcnMsIGdyb3VwKSA9PlxuICAgICAgUmVhY3QuRE9NLnRib2R5KG51bGwsIFxuICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImNvbFNwYW5cIjogNX0sIChncm91cCkpXG4gICAgICAgICksIFxuICAgICAgICAoXy5jaGFpbihwbGF5ZXJzKS5mbGF0dGVuKCkubWFwIChwbGF5ZXIpID0+XG4gICAgICAgICAgdXJsID0gXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJcbiAgICAgICAgICB0aXRsZSA9IFwiI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgICAgIFJlYWN0LkRPTS50cih7XCJrZXlcIjogKHBsYXllci5pZCl9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBSZWFjdC5ET00uYSh7XCJocmVmXCI6ICh1cmwpfSwgKHRpdGxlKSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBSZWFjdC5ET00uc3Ryb25nKG51bGwsIChwbGF5ZXIubnVtYmVyKSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmhlaWdodCkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLndlaWdodCkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnNob290cykpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSwgXG4gICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOaW1pXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOdW1lcm9cIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBpdHV1c1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUGFpbm9cIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIktcXHUwMGU0dGlzeXlzXCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKGdyb3VwcylcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVJvc3RlciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5UZWFtU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHRpdGxlU3R5bGU6IChuYW1lKSAtPlxuICAgIGlmIEBwcm9wcy50ZWFtLmluZm8ubmFtZSBpcyBuYW1lXG4gICAgICBSZWFjdC5ET00uc3Ryb25nKG51bGwsIChuYW1lKSlcbiAgICBlbHNlXG4gICAgICBuYW1lXG5cbiAgbG9nbzogKG5hbWUpIC0+XG4gICAgUmVhY3QuRE9NLmltZyh7XCJzcmNcIjogKFRlYW1zLmxvZ28obmFtZSkpLCBcImFsdFwiOiAobmFtZSl9KVxuXG4gIGdyb3VwZWRTY2hlZHVsZTogLT5cbiAgICBfLmNoYWluKEBwcm9wcy50ZWFtLnNjaGVkdWxlKS5ncm91cEJ5IChtYXRjaCkgLT5cbiAgICAgIG1vbWVudChtYXRjaC5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgcmVuZGVyOiAtPlxuICAgIG1vbnRobHlNYXRjaGVzID0gQGdyb3VwZWRTY2hlZHVsZSgpLm1hcCAobWF0Y2hlcywgbW9udGgpID0+XG4gICAgICBSZWFjdC5ET00udGJvZHkobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgoe1wiY29sU3BhblwiOiA0fSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKVxuICAgICAgICApLCBcbiAgICAgICAgKG1hdGNoZXMubWFwIChtYXRjaCkgPT5cbiAgICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChtYXRjaC5pZCl9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobW9tZW50KG1hdGNoLmRhdGUpLmZvcm1hdChcIkRELk1NLllZWVlcIikpLCBcIiBcIiwgKG1hdGNoLnRpbWUpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLmEoe1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7bWF0Y2guaWR9XCJ9LCAoQHRpdGxlU3R5bGUobWF0Y2guaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUobWF0Y2gudmlzaXRvcikpKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChtYXRjaC5ob21lU2NvcmUpLCBcIi1cIiwgKG1hdGNoLnZpc2l0b3JTY29yZSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobWF0Y2guYXR0ZW5kYW5jZSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBcXHUwMGU0aXZcXHUwMGU0bVxcdTAwZTRcXHUwMGU0clxcdTAwZTRcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkpvdWtrdWVldFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiVHVsb3NcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIllsZWlzXFx1MDBmNm1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKG1vbnRobHlNYXRjaGVzKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtU2NoZWR1bGUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblRlYW1JdGVtID0gcmVxdWlyZSAnLi90ZWFtX2l0ZW0nXG5Ub3BTY29yZXJzID0gcmVxdWlyZSAnLi90b3Bfc2NvcmVycydcblxuVGVhbXNMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJyb3dcIn0sIFxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0ZWFtc192aWV3IGNvbC14cy0xMiBjb2wtc20tNlwifSwgXG4gICAgICAgIChAcHJvcHMudGVhbXMubWFwICh0ZWFtKSAtPiBUZWFtSXRlbShrZXk6IHRlYW0uaWQsIHRlYW06IHRlYW0pKVxuICAgICAgKSwgXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcImNvbC14cy0xMiBjb2wtc20tNlwifSwgXG4gICAgICAgIFRvcFNjb3JlcnMoe1wic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtc0xpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVG9wU2NvcmVycyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk5pbWlcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk90dGVsdXRcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk1hYWxpdFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiU3lcXHUwMGY2dFxcdTAwZjZ0XCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQaXN0ZWV0XCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKEBwcm9wcy5zdGF0cy5zY29yaW5nU3RhdHMuZmlsdGVyIChwbGF5ZXIsIGluZGV4KSAtPlxuICAgICAgICBpbmRleCA8IDIwXG4gICAgICAubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgIFJlYWN0LkRPTS50cih7XCJrZXlcIjogKHBsYXllci5pZCl9LCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nYW1lcykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nb2FscykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5hc3Npc3RzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBvaW50cykpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVG9wU2NvcmVycyJdfQ==
