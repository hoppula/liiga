(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hoppula/repos/liiga_frontend/client.coffee":[function(require,module,exports){
var React, appContainer, director, render, sharedRoutes;

director = require('director');

React = require('react/addons');

sharedRoutes = require('./routes')(require('./lib/ajax'));

appContainer = document.getElementById('app');

render = function(options) {
  if (options == null) {
    options = {};
  }
  window.scrollTo(0, 0);
  document.getElementsByTagName("title")[0].innerHTML = options.title;
  return React.renderComponent(options.component, appContainer);
};

document.addEventListener("DOMContentLoaded", function() {
  var action, route, router, _fn;
  React.initializeTouchEvents(true);
  router = director.Router().configure({
    html5history: true
  });
  _fn = function(route, action) {
    return router.on(route, function() {
      return action.apply(this, arguments).then(function(options) {
        return render(options);
      }).fail(function(error) {
        return console.log("error", error);
      }).done();
    });
  };
  for (route in sharedRoutes) {
    action = sharedRoutes[route];
    _fn(route, action);
  }
  router.init();
  return document.addEventListener('click', function(event) {
    var href, local, properLocal, protocol, relativeUrl, target;
    target = event.target;
    href = target.href;
    protocol = "" + target.protocol + "//";
    local = document.location.host === target.host;
    relativeUrl = href != null ? href.slice(protocol.length + target.host.length) : void 0;
    properLocal = local && relativeUrl.match(/^\//) && !relativeUrl.match(/#$/);
    if (properLocal && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();
      return router.setRoute(target.href);
    }
  });
});



},{"./lib/ajax":"/Users/hoppula/repos/liiga_frontend/lib/ajax.coffee","./routes":"/Users/hoppula/repos/liiga_frontend/routes.coffee","director":"director","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/lib/ajax.coffee":[function(require,module,exports){
var Q, request;

Q = require('q');

request = require('browser-request');

module.exports = {
  environment: "browser",
  fetch: function(options) {
    var deferred, opts;
    deferred = Q.defer();
    opts = {
      url: options.url,
      method: options.method || "GET",
      json: true
    };
    if (options.data) {
      opts.body;
    }
    request(opts, function(err, resp, body) {
      if (err) {
        deferred.reject(err);
        if (options.error) {
          return options.error(err);
        }
      } else {
        deferred.resolve(body);
        if (options.success) {
          return options.success(body);
        }
      }
    });
    return deferred.promise;
  }
};



},{"browser-request":"browser-request","q":"q"}],"/Users/hoppula/repos/liiga_frontend/lib/store.coffee":[function(require,module,exports){
var Q, Store,
  __slice = [].slice;

Q = require('q');

Store = function(ajax) {
  return {
    rootUrl: "http://192.168.11.6:4000/json/",
    data: {
      team: {}
    },
    get: function() {
      var method, params;
      method = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (ajax.environment === "server") {
        return this[method](params);
      } else {
        if (this.data[method]) {
          if (params.length !== 0) {
            if (this.data[method][params[0]]) {
              return Q(this.data[method][params[0]]);
            } else {
              return this[method](params);
            }
          } else {
            return Q(this.data[method]);
          }
        } else {
          return this[method](params);
        }
      }
    },
    teams: function() {
      return ajax.fetch({
        url: "" + this.rootUrl + "teams.json"
      }).then((function(_this) {
        return function(teams) {
          return _this.data.teams = teams;
        };
      })(this));
    },
    team: function(id) {
      return ajax.fetch({
        url: "" + this.rootUrl + id + ".json"
      }).then((function(_this) {
        return function(team) {
          return _this.data.team[id] = team;
        };
      })(this));
    },
    stats: function() {
      return ajax.fetch({
        url: "" + this.rootUrl + "stats.json"
      }).then((function(_this) {
        return function(stats) {
          return _this.data.stats = stats;
        };
      })(this));
    }
  };
};

module.exports = Store;



},{"q":"q"}],"/Users/hoppula/repos/liiga_frontend/lib/teams.coffee":[function(require,module,exports){
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



},{}],"/Users/hoppula/repos/liiga_frontend/routes.coffee":[function(require,module,exports){
var IndexView, PlayerView, Q, React, TeamView;

React = require('react/addons');

Q = require('q');

IndexView = require('./views/index');

TeamView = require('./views/team');

PlayerView = require('./views/player');

module.exports = function(ajax) {
  var Store;
  Store = require("./lib/store")(ajax);
  return {
    "/": function() {
      return Q.spread([Store.get("teams"), Store.get("stats")], function(teamsList, statsList) {
        return {
          title: "Etusivu",
          component: IndexView({
            teams: teamsList,
            stats: statsList
          })
        };
      });
    },
    "/joukkueet/:id": function(id) {
      return Q.spread([Store.get("teams"), Store.get("team", id)], function(teamsList, team) {
        return {
          title: "Joukkueet - " + id,
          component: TeamView({
            id: id,
            teams: teamsList,
            team: team
          })
        };
      });
    },
    "/joukkueet/:id/:pid/:slug": function(id, pid) {
      return Store.get("team", id).then(function(team) {
        return {
          title: "Pelaajat - " + pid,
          component: PlayerView({
            id: pid,
            teamId: id,
            team: team
          })
        };
      });
    },
    "/ottelut/:id": function(id) {
      return Store.get("match", id).then(function(match) {
        return {
          title: "Ottelu - " + id,
          component: MatchView({
            id: id,
            match: match
          })
        };
      });
    }
  };
};



},{"./lib/store":"/Users/hoppula/repos/liiga_frontend/lib/store.coffee","./views/index":"/Users/hoppula/repos/liiga_frontend/views/index.coffee","./views/player":"/Users/hoppula/repos/liiga_frontend/views/player.coffee","./views/team":"/Users/hoppula/repos/liiga_frontend/views/team.coffee","q":"q","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/components/dropdown.coffee":[function(require,module,exports){
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
var Button, ButtonToolbar, Jumbotron, Navigation, PlayerStats, React, TabPane, TabbedArea, Team, TeamRoster, TeamSchedule, Teams, _ref;

React = require('react/addons');

PlayerStats = require('./player_stats');

TeamSchedule = require('./team_schedule');

TeamRoster = require('./team_roster');

Navigation = require('./navigation');

Teams = require('../lib/teams');

_ref = require("react-bootstrap"), TabbedArea = _ref.TabbedArea, TabPane = _ref.TabPane, Jumbotron = _ref.Jumbotron, ButtonToolbar = _ref.ButtonToolbar, Button = _ref.Button;

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
    }, Jumbotron(null, React.DOM.h1(null, this.logo(), " ", this.props.team.info.name), React.DOM.div({
      "className": "team-container"
    }, React.DOM.ul(null, React.DOM.li(null, this.props.team.info.longName), React.DOM.li(null, this.props.team.info.address), React.DOM.li(null, this.props.team.info.email)), ButtonToolbar(null, Button({
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.ticketsUrl
    }, "Liput"), Button({
      "bsStyle": "primary",
      "bsSize": "large",
      "href": this.props.team.info.locationUrl
    }, "Hallin sijainti")))), TabbedArea({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9jbGllbnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvbGliL2FqYXguY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvbGliL3N0b3JlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2xpYi90ZWFtcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9yb3V0ZXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvY29tcG9uZW50cy9kcm9wZG93bi5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9uYXZpZ2F0aW9uLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3BsYXllci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9wbGF5ZXJfc3RhdHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX2l0ZW0uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9yb3N0ZXIuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbV9zY2hlZHVsZS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtc19saXN0LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RvcF9zY29yZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsbURBQUE7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBQVgsQ0FBQTs7QUFBQSxLQUNBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FEUixDQUFBOztBQUFBLFlBS0EsR0FBZSxPQUFBLENBQVEsVUFBUixDQUFBLENBQW9CLE9BQUEsQ0FBUSxZQUFSLENBQXBCLENBTGYsQ0FBQTs7QUFBQSxZQU9BLEdBQWUsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsS0FBeEIsQ0FQZixDQUFBOztBQUFBLE1BU0EsR0FBUyxTQUFDLE9BQUQsR0FBQTs7SUFBQyxVQUFRO0dBQ2hCO0FBQUEsRUFBQSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQUFrQixDQUFsQixDQUFBLENBQUE7QUFBQSxFQUNBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixPQUE5QixDQUF1QyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQTFDLEdBQXNELE9BQU8sQ0FBQyxLQUQ5RCxDQUFBO1NBRUEsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsT0FBTyxDQUFDLFNBQTlCLEVBQXlDLFlBQXpDLEVBSE87QUFBQSxDQVRULENBQUE7O0FBQUEsUUFjUSxDQUFDLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxTQUFBLEdBQUE7QUFDNUMsTUFBQSwwQkFBQTtBQUFBLEVBQUEsS0FBSyxDQUFDLHFCQUFOLENBQTRCLElBQTVCLENBQUEsQ0FBQTtBQUFBLEVBRUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxNQUFULENBQUEsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QjtBQUFBLElBQUEsWUFBQSxF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QUMsS0FBM0IsQ0FIRixFQUlFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVixDQUFhLElBQWIsRUFBb0IsTUFBTSxDQUFDLE9BQTNCLENBSkYsRUFLRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW9CLE1BQU0sQ0FBQyxNQUEzQixDQUxGLEVBREc7SUFBQSxDQUZKLENBVkgsRUFETTtFQUFBLENBQVI7Q0FGVyxDQUZiLENBQUE7O0FBQUEsTUE0Qk0sQ0FBQyxPQUFQLEdBQWlCLFVBNUJqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImRpcmVjdG9yID0gcmVxdWlyZSAnZGlyZWN0b3InXG5SZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuIyBzaGFyZWQgcm91dGVzIGJldHdlZW4gY2xpZW50ICYgc2VydmVyLCBiYXNpY2FsbHkgYWxsIHB1YmxpY1xuIyBHRVQgcm91dGVzIHRoYXQgc2hvdWxkIGdldCBpbmRleGVkIGJ5IHNlYXJjaCBlbmdpbmVzXG5zaGFyZWRSb3V0ZXMgPSByZXF1aXJlKCcuL3JvdXRlcycpKHJlcXVpcmUoJy4vbGliL2FqYXgnKSlcblxuYXBwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ2FwcCdcblxucmVuZGVyID0gKG9wdGlvbnM9e30pIC0+XG4gIHdpbmRvdy5zY3JvbGxUbygwLDApXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gb3B0aW9ucy50aXRsZVxuICBSZWFjdC5yZW5kZXJDb21wb25lbnQob3B0aW9ucy5jb21wb25lbnQsIGFwcENvbnRhaW5lcilcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgLT5cbiAgUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpXG5cbiAgcm91dGVyID0gZGlyZWN0b3IuUm91dGVyKCkuY29uZmlndXJlKGh0bWw1aGlzdG9yeTogdHJ1ZSlcblxuICBmb3Igcm91dGUsIGFjdGlvbiBvZiBzaGFyZWRSb3V0ZXNcbiAgICBkbyAocm91dGUsIGFjdGlvbikgLT5cbiAgICAgIHJvdXRlci5vbiByb3V0ZSwgLT5cbiAgICAgICAgYWN0aW9uLmFwcGx5KEAsIGFyZ3VtZW50cykudGhlbiAob3B0aW9ucykgLT5cbiAgICAgICAgICByZW5kZXIob3B0aW9ucylcbiAgICAgICAgLmZhaWwgKGVycm9yKSAtPlxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiZXJyb3JcIiwgZXJyb3JcbiAgICAgICAgLmRvbmUoKVxuXG4gIHJvdXRlci5pbml0KClcblxuICAjIFRPRE86IGxvYWQgYWxsIHRlYW0gZGF0YSBpbiBvbmUgYmlnIHJlcXVlc3QsXG4gICMgc3RhcnQgbG9hZGluZyBjb25jdXJyZW50bHkgd2l0aCB0ZWFtcy5qc29uXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCAoZXZlbnQpIC0+XG4gICAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gICAgaHJlZiA9IHRhcmdldC5ocmVmXG4gICAgcHJvdG9jb2wgPSBcIiN7dGFyZ2V0LnByb3RvY29sfS8vXCJcblxuICAgICMgcm91dGUgb25seSBsb2NhbCBsaW5rcyB3aXRoIHdlbGwgZGVmaW5lZCByZWxhdGl2ZSBwYXRoc1xuICAgIGxvY2FsID0gZG9jdW1lbnQubG9jYXRpb24uaG9zdCBpcyB0YXJnZXQuaG9zdFxuICAgIHJlbGF0aXZlVXJsID0gaHJlZj8uc2xpY2UocHJvdG9jb2wubGVuZ3RoK3RhcmdldC5ob3N0Lmxlbmd0aClcbiAgICBwcm9wZXJMb2NhbCA9IGxvY2FsIGFuZCByZWxhdGl2ZVVybC5tYXRjaCgvXlxcLy8pIGFuZCBub3QgcmVsYXRpdmVVcmwubWF0Y2goLyMkLylcblxuICAgIGlmIHByb3BlckxvY2FsIGFuZCBub3QgZXZlbnQuYWx0S2V5IGFuZCBub3QgZXZlbnQuY3RybEtleSBhbmQgbm90IGV2ZW50Lm1ldGFLZXkgYW5kIG5vdCBldmVudC5zaGlmdEtleVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgcm91dGVyLnNldFJvdXRlIHRhcmdldC5ocmVmXG5cblxuXG4iLCJRID0gcmVxdWlyZSAncSdcbnJlcXVlc3QgPSByZXF1aXJlICdicm93c2VyLXJlcXVlc3QnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZW52aXJvbm1lbnQ6IFwiYnJvd3NlclwiXG5cbiAgZmV0Y2g6IChvcHRpb25zKSAtPlxuICAgIGRlZmVycmVkID0gUS5kZWZlcigpXG5cbiAgICBvcHRzID1cbiAgICAgIHVybDogb3B0aW9ucy51cmxcbiAgICAgIG1ldGhvZDogb3B0aW9ucy5tZXRob2Qgb3IgXCJHRVRcIlxuICAgICAganNvbjogdHJ1ZVxuXG4gICAgb3B0cy5ib2R5IGlmIG9wdGlvbnMuZGF0YVxuXG4gICAgcmVxdWVzdCBvcHRzLCAoZXJyLCByZXNwLCBib2R5KSAtPlxuICAgICAgaWYgZXJyXG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpXG4gICAgICAgIG9wdGlvbnMuZXJyb3IoZXJyKSBpZiBvcHRpb25zLmVycm9yXG4gICAgICBlbHNlXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoYm9keSlcbiAgICAgICAgb3B0aW9ucy5zdWNjZXNzKGJvZHkpIGlmIG9wdGlvbnMuc3VjY2Vzc1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZSIsIlEgPSByZXF1aXJlICdxJ1xuXG5TdG9yZSA9IChhamF4KSAtPlxuICByb290VXJsOiBcImh0dHA6Ly8xOTIuMTY4LjExLjY6NDAwMC9qc29uL1wiXG5cbiAgZGF0YTpcbiAgICB0ZWFtOiB7fVxuXG4gIGdldDogKG1ldGhvZCwgcGFyYW1zLi4uKSAtPlxuICAgICMgaWYgcnVubmluZyBvbiBzZXJ2ZXIsIGRvIG5vdCBjYWNoZSByZXF1ZXN0c1xuICAgIGlmIGFqYXguZW52aXJvbm1lbnQgaXMgXCJzZXJ2ZXJcIlxuICAgICAgQFttZXRob2RdKHBhcmFtcylcbiAgICBlbHNlXG4gICAgICAjIFRPRE86IGJldHRlciBjYWNoaW5nXG4gICAgICBpZiBAZGF0YVttZXRob2RdXG4gICAgICAgIGlmIHBhcmFtcy5sZW5ndGggaXNudCAwXG4gICAgICAgICAgaWYgQGRhdGFbbWV0aG9kXVtwYXJhbXNbMF1dXG4gICAgICAgICAgICBRKEBkYXRhW21ldGhvZF1bcGFyYW1zWzBdXSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAW21ldGhvZF0ocGFyYW1zKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgUShAZGF0YVttZXRob2RdKVxuICAgICAgZWxzZVxuICAgICAgICBAW21ldGhvZF0ocGFyYW1zKVxuXG4gIHRlYW1zOiAtPlxuICAgIGFqYXguZmV0Y2godXJsOiBcIiN7QHJvb3RVcmx9dGVhbXMuanNvblwiKS50aGVuICh0ZWFtcykgPT5cbiAgICAgIEBkYXRhLnRlYW1zID0gdGVhbXNcblxuICB0ZWFtOiAoaWQpIC0+XG4gICAgYWpheC5mZXRjaCh1cmw6IFwiI3tAcm9vdFVybH0je2lkfS5qc29uXCIpLnRoZW4gKHRlYW0pID0+XG4gICAgICBAZGF0YS50ZWFtW2lkXSA9IHRlYW1cblxuICBzdGF0czogLT5cbiAgICBhamF4LmZldGNoKHVybDogXCIje0Byb290VXJsfXN0YXRzLmpzb25cIikudGhlbiAoc3RhdHMpID0+XG4gICAgICBAZGF0YS5zdGF0cyA9IHN0YXRzXG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmUiLCJUZWFtcyA9XG4gIG5hbWVzQW5kSWRzOlxuICAgIFwiw4Rzc8OkdFwiOiBcImFzc2F0XCJcbiAgICBcIkJsdWVzXCI6IFwiYmx1ZXNcIlxuICAgIFwiSElGS1wiOiBcImhpZmtcIlxuICAgIFwiSFBLXCI6IFwiaHBrXCJcbiAgICBcIklsdmVzXCI6IFwiaWx2ZXNcIlxuICAgIFwiU3BvcnRcIjogXCJzcG9ydFwiXG4gICAgXCJKWVBcIjogXCJqeXBcIlxuICAgIFwiS2FsUGFcIjogXCJrYWxwYVwiXG4gICAgXCJLw6RycMOkdFwiOiBcImthcnBhdFwiXG4gICAgXCJMdWtrb1wiOiBcImx1a2tvXCJcbiAgICBcIlBlbGljYW5zXCI6IFwicGVsaWNhbnNcIlxuICAgIFwiU2FpUGFcIjogXCJzYWlwYVwiXG4gICAgXCJUYXBwYXJhXCI6IFwidGFwcGFyYVwiXG4gICAgXCJUUFNcIjogXCJ0cHNcIlxuXG4gIGxvZ286IChuYW1lKSAtPlxuICAgIFwiLi4vc3ZnLyN7QG5hbWVzQW5kSWRzW25hbWVdfS5zdmdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1zIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5RID0gcmVxdWlyZSAncSdcblxuSW5kZXhWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9pbmRleCdcblRlYW1WaWV3ID0gcmVxdWlyZSAnLi92aWV3cy90ZWFtJ1xuUGxheWVyVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvcGxheWVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhamF4KSAtPlxuICBTdG9yZSA9IHJlcXVpcmUoXCIuL2xpYi9zdG9yZVwiKShhamF4KVxuXG4gIFwiL1wiOiAtPlxuICAgICMgVE9ETzogd2hlbiByZXF1aXJlZCBzdG9yZXMgZm9yIGZyb250IHBhZ2UgYXJlIGxvYWRlZCxcbiAgICAjIHN0YXJ0IGxvYWRpbmcgb3RoZXIgZnJlcXVlbnRseSBhY2Nlc3NlZCBzdG9yZXNcbiAgICAjIGluIGJhY2tncm91bmQsIHNvIHRoZXkncmUgaW4gY2FjaGUgd2hlbiBuZWVkZWRcbiAgICBRLnNwcmVhZChbU3RvcmUuZ2V0KFwidGVhbXNcIiksIFN0b3JlLmdldChcInN0YXRzXCIpXSwgKHRlYW1zTGlzdCwgc3RhdHNMaXN0KSAtPlxuICAgICAgdGl0bGU6IFwiRXR1c2l2dVwiXG4gICAgICBjb21wb25lbnQ6IEluZGV4Vmlldyh0ZWFtczogdGVhbXNMaXN0LCBzdGF0czogc3RhdHNMaXN0KVxuICAgIClcblxuICBcIi9qb3Vra3VlZXQvOmlkXCI6IChpZCkgLT5cbiAgICBRLnNwcmVhZChbU3RvcmUuZ2V0KFwidGVhbXNcIiksIFN0b3JlLmdldChcInRlYW1cIiwgaWQpXSwgKHRlYW1zTGlzdCwgdGVhbSkgLT5cbiAgICAgIHRpdGxlOiBcIkpvdWtrdWVldCAtICN7aWR9XCJcbiAgICAgIGNvbXBvbmVudDogVGVhbVZpZXcoaWQ6IGlkLCB0ZWFtczogdGVhbXNMaXN0LCB0ZWFtOiB0ZWFtKVxuICAgIClcblxuICBcIi9qb3Vra3VlZXQvOmlkLzpwaWQvOnNsdWdcIjogKGlkLCBwaWQpIC0+XG4gICAgU3RvcmUuZ2V0KFwidGVhbVwiLCBpZCkudGhlbiAodGVhbSkgLT5cbiAgICAgIHRpdGxlOiBcIlBlbGFhamF0IC0gI3twaWR9XCJcbiAgICAgIGNvbXBvbmVudDogUGxheWVyVmlldyhpZDogcGlkLCB0ZWFtSWQ6IGlkLCB0ZWFtOiB0ZWFtKVxuXG4gIFwiL290dGVsdXQvOmlkXCI6IChpZCkgLT5cbiAgICBTdG9yZS5nZXQoXCJtYXRjaFwiLCBpZCkudGhlbiAobWF0Y2gpIC0+XG4gICAgICB0aXRsZTogXCJPdHRlbHUgLSAje2lkfVwiXG4gICAgICBjb21wb25lbnQ6IE1hdGNoVmlldyhpZDogaWQsIG1hdGNoOiBtYXRjaCkiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbmNsYXNzU2V0ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0XG5cbkRyb3Bkb3duID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgb3BlbjogZmFsc2VcblxuICB0b2dnbGVPcGVuOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIEBzZXRTdGF0ZSBvcGVuOiBub3QgQHN0YXRlLm9wZW5cblxuICBjbG9zZTogKGV2ZW50KSAtPlxuICAgIEBzZXRTdGF0ZSBvcGVuOiBmYWxzZVxuXG4gIHJlbmRlcjogLT5cbiAgICBjbGFzc2VzID0gY2xhc3NTZXRcbiAgICAgICdvcGVuJzogQHN0YXRlLm9wZW5cbiAgICAgICdkcm9wZG93bic6IHRydWVcblxuICAgIFJlYWN0LkRPTS5saSh7XCJjbGFzc05hbWVcIjogKGNsYXNzZXMpfSwgXG4gICAgICBSZWFjdC5ET00uYSh7XCJyb2xlXCI6IFwiYnV0dG9uXCIsIFwiaHJlZlwiOiBcIiNcIiwgXCJvbkNsaWNrXCI6IChAdG9nZ2xlT3Blbil9LCAoQHByb3BzLnRpdGxlKSwgXCIgXCIsIFJlYWN0LkRPTS5zcGFuKHtcImNsYXNzTmFtZVwiOiBcImNhcmV0XCJ9KSksIFxuICAgICAgUmVhY3QuRE9NLnVsKHtcImNsYXNzTmFtZVwiOiBcImRyb3Bkb3duLW1lbnVcIiwgXCJyb2xlXCI6IFwibWVudVwifSwgXG4gICAgICAgIChAcHJvcHMuaXRlbXMubWFwIChpdGVtKSA9PlxuICAgICAgICAgIFJlYWN0LkRPTS5saSh7XCJyb2xlXCI6IFwicHJlc2VudGF0aW9uXCIsIFwia2V5XCI6IChpdGVtLnRpdGxlKX0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmEoe1wicm9sZVwiOiBcIm1lbnVpdGVtXCIsIFwidGFiSW5kZXhcIjogXCItMVwiLCBcImhyZWZcIjogKGl0ZW0udXJsKSwgXCJvbkNsaWNrXCI6IChAY2xvc2UpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93biIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zTGlzdFZpZXcgPSByZXF1aXJlICcuL3RlYW1zX2xpc3QnXG5cbkluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgIE5hdmlnYXRpb24obnVsbCksIFxuXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcImp1bWJvdHJvblwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIkxpaWdhLnB3XCIpLCBcbiAgICAgICAgUmVhY3QuRE9NLnAobnVsbCwgXCJLYWlra2kgTGlpZ2FzdGEgbm9wZWFzdGkgamEgdmFpdmF0dG9tYXN0aVwiKVxuICAgICAgKSwgXG5cbiAgICAgIFRlYW1zTGlzdFZpZXcoe1widGVhbXNcIjogKEBwcm9wcy50ZWFtcyksIFwic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBJbmRleCIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuRHJvcGRvd24gPSByZXF1aXJlICcuL2NvbXBvbmVudHMvZHJvcGRvd24nXG5cbntOYXZiYXIsIE5hdiwgTmF2SXRlbSwgRHJvcGRvd25CdXR0b24sIE1lbnVJdGVtfSA9IHJlcXVpcmUgXCJyZWFjdC1ib290c3RyYXBcIlxuXG5OYXZpZ2F0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgYnJhbmQgPSBSZWFjdC5ET00uYSh7XCJocmVmXCI6IFwiL1wiLCBcImNsYXNzTmFtZVwiOiBcIm5hdmJhci1icmFuZFwifSwgXCJMaWlnYVwiKVxuXG4gICAgaWYgQHByb3BzLnRlYW1cbiAgICAgIGNvbnNvbGUubG9nIFwidGVhbVwiLCBAcHJvcHMudGVhbVxuICAgICAgdGVhbSA9IE5hdkl0ZW0oe1wiaHJlZlwiOiAoQHByb3BzLnRlYW0uaW5mby51cmwpfSwgKEBwcm9wcy50ZWFtLmluZm8ubmFtZSkpXG5cbiAgICBpZiBAcHJvcHMuZHJvcGRvd25cbiAgICAgIGRyb3Bkb3duID0gRHJvcGRvd25CdXR0b24oe1widGl0bGVcIjogKEBwcm9wcy5kcm9wZG93bi50aXRsZSksIFwib25TZWxlY3RcIjogKC0+KX0sIFxuICAgICAgICAoQHByb3BzLmRyb3Bkb3duLml0ZW1zLm1hcCAoaXRlbSkgLT5cbiAgICAgICAgICBNZW51SXRlbSh7XCJrZXlcIjogKGl0ZW0udGl0bGUpLCBcImhyZWZcIjogKGl0ZW0udXJsKX0sIChpdGVtLnRpdGxlKSlcbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgTmF2YmFyKHtcImJyYW5kXCI6IChicmFuZCksIFwiZml4ZWRUb3BcIjogdHJ1ZSwgXCJ0b2dnbGVOYXZLZXlcIjogKDApfSwgXG4gICAgICBOYXYoe1wiY2xhc3NOYW1lXCI6IFwiYnMtbmF2YmFyLWNvbGxhcHNlXCIsIFwia2V5XCI6ICgwKSwgXCJyb2xlXCI6IFwibmF2aWdhdGlvblwifSwgXG4gICAgICAgICh0ZWFtKSwgXG4gICAgICAgIChkcm9wZG93bilcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG5QbGF5ZXIgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICB0ZWFtSWQgPSBAcHJvcHMudGVhbUlkXG4gICAgcm9zdGVyID0gQHByb3BzLnRlYW0ucm9zdGVyXG5cbiAgICBwbGF5ZXJzID1cbiAgICAgIHRpdGxlOiBcIlBlbGFhamF0XCIsXG4gICAgICBpdGVtczogcm9zdGVyLm1hcCAocGxheWVyKSA9PlxuICAgICAgICB0aXRsZTogXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgIHVybDogXCIvam91a2t1ZWV0LyN7dGVhbUlkfS8je3BsYXllci5pZH1cIlxuXG4gICAgcGxheWVyID0gQHByb3BzLnRlYW0ucm9zdGVyLmZpbHRlcigocGxheWVyKSA9PlxuICAgICAgW2lkLCBzbHVnXSA9IHBsYXllci5pZC5zcGxpdChcIi9cIilcbiAgICAgIGlkIGlzIEBwcm9wcy5pZFxuICAgIClbMF1cblxuICAgIGNvbnNvbGUubG9nIFwicGxheWVyXCIsIHBsYXllclxuXG4gICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgIE5hdmlnYXRpb24oe1wiZHJvcGRvd25cIjogKHBsYXllcnMpLCBcInRlYW1cIjogKEBwcm9wcy50ZWFtKX0pLCBcblxuICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXIiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuUGxheWVyU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSwgXG4gICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOYW1lXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJHYW1lc1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiR29hbHNcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkFzc2lzdHNcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBvaW50c1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUGVuYWx0aWVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCIrXFx4MkYtXCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKEBwcm9wcy5zdGF0cy5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgUmVhY3QuRE9NLnRyKHtcImtleVwiOiAocGxheWVyLmlkKX0sIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBSZWFjdC5ET00uYSh7XCJocmVmXCI6IFwiL2pvdWtrdWVldFwifSwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcXHgzRVwiLCAocGxheWVyLmxhc3ROYW1lKSkpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nYW1lcykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nb2FscykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5hc3Npc3RzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBvaW50cykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIucGx1c01pbnVzKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuUGxheWVyU3RhdHMgPSByZXF1aXJlICcuL3BsYXllcl9zdGF0cydcblRlYW1TY2hlZHVsZSA9IHJlcXVpcmUgJy4vdGVhbV9zY2hlZHVsZSdcblRlYW1Sb3N0ZXIgPSByZXF1aXJlICcuL3RlYW1fcm9zdGVyJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zID0gcmVxdWlyZSAnLi4vbGliL3RlYW1zJ1xuXG57VGFiYmVkQXJlYSwgVGFiUGFuZSwgSnVtYm90cm9uLCBCdXR0b25Ub29sYmFyLCBCdXR0b259ID0gcmVxdWlyZSBcInJlYWN0LWJvb3RzdHJhcFwiXG5cblRlYW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIGxvZ286IC0+XG4gICAgUmVhY3QuRE9NLmltZyh7XCJzcmNcIjogKFRlYW1zLmxvZ28oQHByb3BzLnRlYW0uaW5mby5uYW1lKSksIFwiYWx0XCI6IChAcHJvcHMudGVhbS5pbmZvLm5hbWUpfSlcblxuICByZW5kZXI6IC0+XG4gICAgdGVhbXMgPVxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0XCIsXG4gICAgICBpdGVtczogQHByb3BzLnRlYW1zLm1hcCAodGVhbSkgLT5cbiAgICAgICAgdGl0bGU6IHRlYW0ubmFtZVxuICAgICAgICB1cmw6IHRlYW0udXJsXG5cbiAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgTmF2aWdhdGlvbih7XCJkcm9wZG93blwiOiAodGVhbXMpfSksIFxuXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcInRlYW1cIn0sIFxuICAgICAgICBKdW1ib3Ryb24obnVsbCwgXG4gICAgICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIChAbG9nbygpKSwgXCIgXCIsIChAcHJvcHMudGVhbS5pbmZvLm5hbWUpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0ZWFtLWNvbnRhaW5lclwifSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udWwobnVsbCwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCAoQHByb3BzLnRlYW0uaW5mby5sb25nTmFtZSkpLCBcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLmxpKG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmFkZHJlc3MpKSwgXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCAoQHByb3BzLnRlYW0uaW5mby5lbWFpbCkpXG4gICAgICAgICAgICApLCBcblxuICAgICAgICAgICAgQnV0dG9uVG9vbGJhcihudWxsLCBcbiAgICAgICAgICAgICAgQnV0dG9uKHtcImJzU3R5bGVcIjogXCJwcmltYXJ5XCIsIFwiYnNTaXplXCI6IFwibGFyZ2VcIiwgXCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLnRpY2tldHNVcmwpfSwgXCJMaXB1dFwiKSwgXG4gICAgICAgICAgICAgIEJ1dHRvbih7XCJic1N0eWxlXCI6IFwicHJpbWFyeVwiLCBcImJzU2l6ZVwiOiBcImxhcmdlXCIsIFwiaHJlZlwiOiAoQHByb3BzLnRlYW0uaW5mby5sb2NhdGlvblVybCl9LCBcIkhhbGxpbiBzaWphaW50aVwiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG5cbiAgICAgICAgVGFiYmVkQXJlYSh7XCJkZWZhdWx0QWN0aXZlS2V5XCI6ICgxKSwgXCJhbmltYXRpb25cIjogKGZhbHNlKX0sIFxuICAgICAgICAgIFRhYlBhbmUoe1wia2V5XCI6ICgxKSwgXCJ0YWJcIjogXCJPdHRlbHV0XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIk90dGVsdXRcIiksIFxuICAgICAgICAgICAgVGVhbVNjaGVkdWxlKHtcInRlYW1cIjogKEBwcm9wcy50ZWFtKX0pXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgVGFiUGFuZSh7XCJrZXlcIjogKDIpLCBcInRhYlwiOiBcIlBlbGFhamF0XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIlBlbGFhamF0XCIpLCBcbiAgICAgICAgICAgIFRlYW1Sb3N0ZXIoe1widGVhbUlkXCI6IChAcHJvcHMuaWQpLCBcInJvc3RlclwiOiAoQHByb3BzLnRlYW0ucm9zdGVyKX0pXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW0iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVGVhbUl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00uYSh7XCJjbGFzc05hbWVcIjogXCJ0ZWFtICN7QHByb3BzLnRlYW0uaWR9IGJ0biBidG4tZGVmYXVsdCBidG4tbGcgYnRuLWJsb2NrXCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbS5pZH1cIn0sIFxuICAgICAgKEBwcm9wcy50ZWFtLm5hbWUpXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1JdGVtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5UZWFtUm9zdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBncm91cGVkUm9zdGVyOiAtPlxuICAgIF8uY2hhaW4oQHByb3BzLnJvc3RlcilcbiAgICAuZ3JvdXBCeSgocGxheWVyKSAtPiBwbGF5ZXIucG9zaXRpb24pXG4gICAgLnJlZHVjZSgocmVzdWx0LCBwbGF5ZXIsIHBvc2l0aW9uKSAtPlxuICAgICAgZ3JvdXAgPSBzd2l0Y2hcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiS0hcIiwgXCJPTFwiLCBcIlZMXCJdLCBwb3NpdGlvbikgdGhlbiBcIkh5w7Zra8Okw6Rqw6R0XCJcbiAgICAgICAgd2hlbiBfLmluY2x1ZGUoW1wiT1BcIiwgXCJWUFwiXSwgcG9zaXRpb24pIHRoZW4gXCJQdW9sdXN0YWphdFwiXG4gICAgICAgIHdoZW4gcG9zaXRpb24gaXMgXCJNVlwiIHRoZW4gXCJNYWFsaXZhaGRpdFwiXG4gICAgICByZXN1bHRbZ3JvdXBdIHx8PSBbXVxuICAgICAgcmVzdWx0W2dyb3VwXS5wdXNoIHBsYXllclxuICAgICAgcmVzdWx0XG4gICAgLCB7fSlcblxuICByZW5kZXI6IC0+XG4gICAgZ3JvdXBzID0gQGdyb3VwZWRSb3N0ZXIoKS5tYXAgKHBsYXllcnMsIGdyb3VwKSA9PlxuICAgICAgUmVhY3QuRE9NLnRib2R5KG51bGwsIFxuICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKHtcImNvbFNwYW5cIjogNX0sIChncm91cCkpXG4gICAgICAgICksIFxuICAgICAgICAoXy5jaGFpbihwbGF5ZXJzKS5mbGF0dGVuKCkubWFwIChwbGF5ZXIpID0+XG4gICAgICAgICAgdXJsID0gXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW1JZH0vI3twbGF5ZXIuaWR9XCJcbiAgICAgICAgICB0aXRsZSA9IFwiI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgICAgIFJlYWN0LkRPTS50cih7XCJrZXlcIjogKHBsYXllci5pZCl9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBSZWFjdC5ET00uYSh7XCJocmVmXCI6ICh1cmwpfSwgKHRpdGxlKSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBSZWFjdC5ET00uc3Ryb25nKG51bGwsIChwbGF5ZXIubnVtYmVyKSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmhlaWdodCkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLndlaWdodCkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnNob290cykpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXJvc3RlclwifSwgXG4gICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOaW1pXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOdW1lcm9cIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBpdHV1c1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUGFpbm9cIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIktcXHUwMGU0dGlzeXlzXCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKGdyb3VwcylcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVJvc3RlciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGVhbXMgPSByZXF1aXJlICcuLi9saWIvdGVhbXMnXG5cbm1vbWVudC5sb2NhbGUoJ2ZpJ1xuICBtb250aHMgOiBbXG4gICAgXCJUYW1taWt1dVwiLCBcIkhlbG1pa3V1XCIsIFwiTWFhbGlza3V1XCIsIFwiSHVodGlrdXVcIiwgXCJUb3Vrb2t1dVwiLCBcIktlc8Oka3V1XCIsIFwiSGVpbsOka3V1XCIsXG4gICAgXCJFbG9rdXVcIiwgXCJTeXlza3V1XCIsIFwiTG9rYWt1dVwiLCBcIk1hcnJhc2t1dVwiLCBcIkpvdWx1a3V1XCJcbiAgXVxuKVxubW9tZW50LmxvY2FsZSgnZmknKVxuXG5UZWFtU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHRpdGxlU3R5bGU6IChuYW1lKSAtPlxuICAgIGlmIEBwcm9wcy50ZWFtLmluZm8ubmFtZSBpcyBuYW1lXG4gICAgICBSZWFjdC5ET00uc3Ryb25nKG51bGwsIChuYW1lKSlcbiAgICBlbHNlXG4gICAgICBuYW1lXG5cbiAgbG9nbzogKG5hbWUpIC0+XG4gICAgUmVhY3QuRE9NLmltZyh7XCJzcmNcIjogKFRlYW1zLmxvZ28obmFtZSkpLCBcImFsdFwiOiAobmFtZSl9KVxuXG4gIGdyb3VwZWRTY2hlZHVsZTogLT5cbiAgICBfLmNoYWluKEBwcm9wcy50ZWFtLnNjaGVkdWxlKS5ncm91cEJ5IChtYXRjaCkgLT5cbiAgICAgIG1vbWVudChtYXRjaC5kYXRlKS5mb3JtYXQoXCJZWVlZLU1NXCIpXG5cbiAgcmVuZGVyOiAtPlxuICAgIG1vbnRobHlNYXRjaGVzID0gQGdyb3VwZWRTY2hlZHVsZSgpLm1hcCAobWF0Y2hlcywgbW9udGgpID0+XG4gICAgICBSZWFjdC5ET00udGJvZHkobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgoe1wiY29sU3BhblwiOiA0fSwgKG1vbWVudChtb250aCwgXCJZWVlZLU1NXCIpLmZvcm1hdChcIk1NTU1cIikpKVxuICAgICAgICApLCBcbiAgICAgICAgKG1hdGNoZXMubWFwIChtYXRjaCkgPT5cbiAgICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChtYXRjaC5pZCl9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobW9tZW50KG1hdGNoLmRhdGUpLmZvcm1hdChcIkRELk1NLllZWVlcIikpLCBcIiBcIiwgKG1hdGNoLnRpbWUpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLmEoe1wiaHJlZlwiOiBcIi9vdHRlbHV0LyN7bWF0Y2guaWR9XCJ9LCAoQHRpdGxlU3R5bGUobWF0Y2guaG9tZSkpLCBcIiAtIFwiLCAoQHRpdGxlU3R5bGUobWF0Y2gudmlzaXRvcikpKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChtYXRjaC5ob21lU2NvcmUpLCBcIi1cIiwgKG1hdGNoLnZpc2l0b3JTY29yZSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobWF0Y2guYXR0ZW5kYW5jZSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZCB0ZWFtLXNjaGVkdWxlXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBcXHUwMGU0aXZcXHUwMGU0bVxcdTAwZTRcXHUwMGU0clxcdTAwZTRcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkpvdWtrdWVldFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiVHVsb3NcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIllsZWlzXFx1MDBmNm1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKG1vbnRobHlNYXRjaGVzKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtU2NoZWR1bGUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblRlYW1JdGVtID0gcmVxdWlyZSAnLi90ZWFtX2l0ZW0nXG5Ub3BTY29yZXJzID0gcmVxdWlyZSAnLi90b3Bfc2NvcmVycydcblxuVGVhbXNMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJyb3dcIn0sIFxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0ZWFtc192aWV3IGNvbC14cy0xMiBjb2wtc20tNlwifSwgXG4gICAgICAgIChAcHJvcHMudGVhbXMubWFwICh0ZWFtKSAtPiBUZWFtSXRlbShrZXk6IHRlYW0uaWQsIHRlYW06IHRlYW0pKVxuICAgICAgKSwgXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcImNvbC14cy0xMiBjb2wtc20tNlwifSwgXG4gICAgICAgIFRvcFNjb3JlcnMoe1wic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtc0xpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVG9wU2NvcmVycyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk5pbWlcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk90dGVsdXRcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk1hYWxpdFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiU3lcXHUwMGY2dFxcdTAwZjZ0XCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQaXN0ZWV0XCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKEBwcm9wcy5zdGF0cy5zY29yaW5nU3RhdHMuZmlsdGVyIChwbGF5ZXIsIGluZGV4KSAtPlxuICAgICAgICBpbmRleCA8IDIwXG4gICAgICAubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgIFJlYWN0LkRPTS50cih7XCJrZXlcIjogKHBsYXllci5pZCl9LCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nYW1lcykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nb2FscykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5hc3Npc3RzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBvaW50cykpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVG9wU2NvcmVycyJdfQ==
