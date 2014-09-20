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



},{"q":"q"}],"/Users/hoppula/repos/liiga_frontend/routes.coffee":[function(require,module,exports){
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
    var brand, dropdown;
    brand = React.DOM.a({
      "href": "/",
      "className": "navbar-brand"
    }, "Liiga");
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
    }, dropdown));
  }
});

module.exports = Navigation;



},{"./components/dropdown":"/Users/hoppula/repos/liiga_frontend/views/components/dropdown.coffee","react-bootstrap":"react-bootstrap","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player.coffee":[function(require,module,exports){
var Dropdown, Navigation, Player, React;

React = require('react/addons');

Dropdown = require('./components/dropdown');

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
    console.log(this.props.id);
    player = this.props.team.roster.filter((function(_this) {
      return function(player) {
        var id, slug, _ref;
        _ref = player.id.split("/"), id = _ref[0], slug = _ref[1];
        return id === _this.props.id;
      };
    })(this))[0];
    console.log("player", player);
    return React.DOM.div(null, Navigation({
      "dropdown": players
    }), React.DOM.h1(null, player.firstName, " ", player.lastName));
  }
});

module.exports = Player;



},{"./components/dropdown":"/Users/hoppula/repos/liiga_frontend/views/components/dropdown.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee":[function(require,module,exports){
var PlayerStats, React;

React = require('react/addons');

PlayerStats = React.createClass({
  render: function() {
    return React.DOM.table({
      "className": "table table-striped"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Name"), React.DOM.th(null, "Games"), React.DOM.th(null, "Goals"), React.DOM.th(null, "Assists"), React.DOM.th(null, "Points"), React.DOM.th(null, "Penalties"), React.DOM.th(null, "+\x2F-"))), this.props.stats.map(function(player) {
      return React.DOM.tr({
        "key": player.id
      }, React.DOM.td(null, player.firstName, " \x3E", player.lastName), React.DOM.td(null, player.games), React.DOM.td(null, player.goals), React.DOM.td(null, player.assists), React.DOM.td(null, player.points), React.DOM.td(null, player.penalties), React.DOM.td(null, player.plusMinus));
    }));
  }
});

module.exports = PlayerStats;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team.coffee":[function(require,module,exports){
var Dropdown, Navigation, PlayerStats, React, Team, TeamRoster, TeamSchedule;

React = require('react/addons');

PlayerStats = require('./player_stats');

TeamSchedule = require('./team_schedule');

TeamRoster = require('./team_roster');

Dropdown = require('./components/dropdown');

Navigation = require('./navigation');

Team = React.createClass({
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
    }, React.DOM.h1(null, this.props.team.info.name), React.DOM.div({
      "className": "team-container"
    }, React.DOM.ul(null, React.DOM.li(null, this.props.team.info.longName), React.DOM.li(null, this.props.team.info.address), React.DOM.li(null, this.props.team.info.email)), React.DOM.a({
      "href": this.props.team.info.ticketsUrl
    }, "Liput"), React.DOM.a({
      "href": this.props.team.info.locationUrl
    }, "Hallin sijainti")), React.DOM.h1(null, "Ottelut"), TeamSchedule({
      "schedule": this.props.team.schedule
    }), React.DOM.h1(null, "Pelaajat"), TeamRoster({
      "teamId": this.props.id,
      "roster": this.props.team.roster
    })));
  }
});

module.exports = Team;



},{"./components/dropdown":"/Users/hoppula/repos/liiga_frontend/views/components/dropdown.coffee","./navigation":"/Users/hoppula/repos/liiga_frontend/views/navigation.coffee","./player_stats":"/Users/hoppula/repos/liiga_frontend/views/player_stats.coffee","./team_roster":"/Users/hoppula/repos/liiga_frontend/views/team_roster.coffee","./team_schedule":"/Users/hoppula/repos/liiga_frontend/views/team_schedule.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_item.coffee":[function(require,module,exports){
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
var React, TeamRoster;

React = require('react/addons');

TeamRoster = React.createClass({
  render: function() {
    return React.DOM.table({
      "className": "table table-striped"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "Nimi"), React.DOM.th(null, "Numero"), React.DOM.th(null, "Pituus"), React.DOM.th(null, "Paino"), React.DOM.th(null, "K\u00e4tisyys"))), this.props.roster.map((function(_this) {
      return function(player) {
        var title, url;
        url = "/joukkueet/" + _this.props.teamId + "/" + player.id;
        title = "" + player.firstName + " " + player.lastName;
        return React.DOM.tr({
          "key": player.id
        }, React.DOM.td(null, React.DOM.a({
          "href": url
        }, title)), React.DOM.td(null, player.number), React.DOM.td(null, player.height), React.DOM.td(null, player.weight), React.DOM.td(null, player.shoots));
      };
    })(this)));
  }
});

module.exports = TeamRoster;



},{"react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/team_schedule.coffee":[function(require,module,exports){
var React, TeamSchedule, moment;

React = require('react/addons');

moment = require('moment');

TeamSchedule = React.createClass({
  render: function() {
    return React.DOM.table({
      "className": "table table-striped"
    }, React.DOM.thead(null, React.DOM.tr(null, React.DOM.th(null, "P\u00e4iv\u00e4m\u00e4\u00e4r\u00e4"), React.DOM.th(null, "Joukkueet"), React.DOM.th(null, "Tulos"), React.DOM.th(null, "Yleis\u00f6m\u00e4\u00e4r\u00e4"))), this.props.schedule.map(function(match, i) {
      return React.DOM.tr({
        "key": match.id
      }, React.DOM.td(null, moment(match.date).format("DD.MM.YYYY"), " ", match.time), React.DOM.td(null, match.home, " - ", match.visitor), React.DOM.td(null, match.homeScore, "-", match.visitorScore), React.DOM.td(null, match.attendance));
    }));
  }
});

module.exports = TeamSchedule;



},{"moment":"moment","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/teams_list.coffee":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9jbGllbnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvbGliL2FqYXguY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvbGliL3N0b3JlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3JvdXRlcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9jb21wb25lbnRzL2Ryb3Bkb3duLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL2luZGV4LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL25hdmlnYXRpb24uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvcGxheWVyLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3BsYXllcl9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1faXRlbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3Jvc3Rlci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3NjaGVkdWxlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1zX2xpc3QuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdG9wX3Njb3JlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxtREFBQTs7QUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FBWCxDQUFBOztBQUFBLEtBQ0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQURSLENBQUE7O0FBQUEsWUFLQSxHQUFlLE9BQUEsQ0FBUSxVQUFSLENBQUEsQ0FBb0IsT0FBQSxDQUFRLFlBQVIsQ0FBcEIsQ0FMZixDQUFBOztBQUFBLFlBT0EsR0FBZSxRQUFRLENBQUMsY0FBVCxDQUF3QixLQUF4QixDQVBmLENBQUE7O0FBQUEsTUFTQSxHQUFTLFNBQUMsT0FBRCxHQUFBOztJQUFDLFVBQVE7R0FDaEI7QUFBQSxFQUFBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQWhCLEVBQWtCLENBQWxCLENBQUEsQ0FBQTtBQUFBLEVBQ0EsUUFBUSxDQUFDLG9CQUFULENBQThCLE9BQTlCLENBQXVDLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBMUMsR0FBc0QsT0FBTyxDQUFDLEtBRDlELENBQUE7U0FFQSxLQUFLLENBQUMsZUFBTixDQUFzQixPQUFPLENBQUMsU0FBOUIsRUFBeUMsWUFBekMsRUFITztBQUFBLENBVFQsQ0FBQTs7QUFBQSxRQWNRLENBQUMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFNBQUEsR0FBQTtBQUM1QyxNQUFBLDBCQUFBO0FBQUEsRUFBQSxLQUFLLENBQUMscUJBQU4sQ0FBNEIsSUFBNUIsQ0FBQSxDQUFBO0FBQUEsRUFFQSxNQUFBLEdBQVMsUUFBUSxDQUFDLE1BQVQsQ0FBQSxDQUFpQixDQUFDLFNBQWxCLENBQTRCO0FBQUEsSUFBQSxZQUFBLEVBQWMsSUFBZDtHQUE1QixDQUZULENBQUE7QUFJQSxRQUNLLFNBQUMsS0FBRCxFQUFRLE1BQVIs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RixFQUlFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVixDQUFhLElBQWIsRUFBb0IsTUFBTSxDQUFDLE9BQTNCLENBSkYsRUFLRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxJQUFiLEVBQW9CLE1BQU0sQ0FBQyxNQUEzQixDQUxGLEVBREc7SUFBQSxDQUZKLENBVkgsRUFETTtFQUFBLENBQVI7Q0FGVyxDQUZiLENBQUE7O0FBQUEsTUE0Qk0sQ0FBQyxPQUFQLEdBQWlCLFVBNUJqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImRpcmVjdG9yID0gcmVxdWlyZSAnZGlyZWN0b3InXG5SZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuIyBzaGFyZWQgcm91dGVzIGJldHdlZW4gY2xpZW50ICYgc2VydmVyLCBiYXNpY2FsbHkgYWxsIHB1YmxpY1xuIyBHRVQgcm91dGVzIHRoYXQgc2hvdWxkIGdldCBpbmRleGVkIGJ5IHNlYXJjaCBlbmdpbmVzXG5zaGFyZWRSb3V0ZXMgPSByZXF1aXJlKCcuL3JvdXRlcycpKHJlcXVpcmUoJy4vbGliL2FqYXgnKSlcblxuYXBwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ2FwcCdcblxucmVuZGVyID0gKG9wdGlvbnM9e30pIC0+XG4gIHdpbmRvdy5zY3JvbGxUbygwLDApXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gb3B0aW9ucy50aXRsZVxuICBSZWFjdC5yZW5kZXJDb21wb25lbnQob3B0aW9ucy5jb21wb25lbnQsIGFwcENvbnRhaW5lcilcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgLT5cbiAgUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpXG5cbiAgcm91dGVyID0gZGlyZWN0b3IuUm91dGVyKCkuY29uZmlndXJlKGh0bWw1aGlzdG9yeTogdHJ1ZSlcblxuICBmb3Igcm91dGUsIGFjdGlvbiBvZiBzaGFyZWRSb3V0ZXNcbiAgICBkbyAocm91dGUsIGFjdGlvbikgLT5cbiAgICAgIHJvdXRlci5vbiByb3V0ZSwgLT5cbiAgICAgICAgYWN0aW9uLmFwcGx5KEAsIGFyZ3VtZW50cykudGhlbiAob3B0aW9ucykgLT5cbiAgICAgICAgICByZW5kZXIob3B0aW9ucylcbiAgICAgICAgLmZhaWwgKGVycm9yKSAtPlxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiZXJyb3JcIiwgZXJyb3JcbiAgICAgICAgLmRvbmUoKVxuXG4gIHJvdXRlci5pbml0KClcblxuICAjIFRPRE86IGxvYWQgYWxsIHRlYW0gZGF0YSBpbiBvbmUgYmlnIHJlcXVlc3QsXG4gICMgc3RhcnQgbG9hZGluZyBjb25jdXJyZW50bHkgd2l0aCB0ZWFtcy5qc29uXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCAoZXZlbnQpIC0+XG4gICAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gICAgaHJlZiA9IHRhcmdldC5ocmVmXG4gICAgcHJvdG9jb2wgPSBcIiN7dGFyZ2V0LnByb3RvY29sfS8vXCJcblxuICAgICMgcm91dGUgb25seSBsb2NhbCBsaW5rcyB3aXRoIHdlbGwgZGVmaW5lZCByZWxhdGl2ZSBwYXRoc1xuICAgIGxvY2FsID0gZG9jdW1lbnQubG9jYXRpb24uaG9zdCBpcyB0YXJnZXQuaG9zdFxuICAgIHJlbGF0aXZlVXJsID0gaHJlZj8uc2xpY2UocHJvdG9jb2wubGVuZ3RoK3RhcmdldC5ob3N0Lmxlbmd0aClcbiAgICBwcm9wZXJMb2NhbCA9IGxvY2FsIGFuZCByZWxhdGl2ZVVybC5tYXRjaCgvXlxcLy8pIGFuZCBub3QgcmVsYXRpdmVVcmwubWF0Y2goLyMkLylcblxuICAgIGlmIHByb3BlckxvY2FsIGFuZCBub3QgZXZlbnQuYWx0S2V5IGFuZCBub3QgZXZlbnQuY3RybEtleSBhbmQgbm90IGV2ZW50Lm1ldGFLZXkgYW5kIG5vdCBldmVudC5zaGlmdEtleVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgcm91dGVyLnNldFJvdXRlIHRhcmdldC5ocmVmXG5cblxuXG4iLCJRID0gcmVxdWlyZSAncSdcbnJlcXVlc3QgPSByZXF1aXJlICdicm93c2VyLXJlcXVlc3QnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZW52aXJvbm1lbnQ6IFwiYnJvd3NlclwiXG5cbiAgZmV0Y2g6IChvcHRpb25zKSAtPlxuICAgIGRlZmVycmVkID0gUS5kZWZlcigpXG5cbiAgICBvcHRzID1cbiAgICAgIHVybDogb3B0aW9ucy51cmxcbiAgICAgIG1ldGhvZDogb3B0aW9ucy5tZXRob2Qgb3IgXCJHRVRcIlxuICAgICAganNvbjogdHJ1ZVxuXG4gICAgb3B0cy5ib2R5IGlmIG9wdGlvbnMuZGF0YVxuXG4gICAgcmVxdWVzdCBvcHRzLCAoZXJyLCByZXNwLCBib2R5KSAtPlxuICAgICAgaWYgZXJyXG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpXG4gICAgICAgIG9wdGlvbnMuZXJyb3IoZXJyKSBpZiBvcHRpb25zLmVycm9yXG4gICAgICBlbHNlXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoYm9keSlcbiAgICAgICAgb3B0aW9ucy5zdWNjZXNzKGJvZHkpIGlmIG9wdGlvbnMuc3VjY2Vzc1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZSIsIlEgPSByZXF1aXJlICdxJ1xuXG5TdG9yZSA9IChhamF4KSAtPlxuICByb290VXJsOiBcImh0dHA6Ly8xOTIuMTY4LjExLjY6NDAwMC9qc29uL1wiXG5cbiAgZGF0YTpcbiAgICB0ZWFtOiB7fVxuXG4gIGdldDogKG1ldGhvZCwgcGFyYW1zLi4uKSAtPlxuICAgICMgaWYgcnVubmluZyBvbiBzZXJ2ZXIsIGRvIG5vdCBjYWNoZSByZXF1ZXN0c1xuICAgIGlmIGFqYXguZW52aXJvbm1lbnQgaXMgXCJzZXJ2ZXJcIlxuICAgICAgQFttZXRob2RdKHBhcmFtcylcbiAgICBlbHNlXG4gICAgICAjIFRPRE86IGJldHRlciBjYWNoaW5nXG4gICAgICBpZiBAZGF0YVttZXRob2RdXG4gICAgICAgIGlmIHBhcmFtcy5sZW5ndGggaXNudCAwXG4gICAgICAgICAgaWYgQGRhdGFbbWV0aG9kXVtwYXJhbXNbMF1dXG4gICAgICAgICAgICBRKEBkYXRhW21ldGhvZF1bcGFyYW1zWzBdXSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAW21ldGhvZF0ocGFyYW1zKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgUShAZGF0YVttZXRob2RdKVxuICAgICAgZWxzZVxuICAgICAgICBAW21ldGhvZF0ocGFyYW1zKVxuXG4gIHRlYW1zOiAtPlxuICAgIGFqYXguZmV0Y2godXJsOiBcIiN7QHJvb3RVcmx9dGVhbXMuanNvblwiKS50aGVuICh0ZWFtcykgPT5cbiAgICAgIEBkYXRhLnRlYW1zID0gdGVhbXNcblxuICB0ZWFtOiAoaWQpIC0+XG4gICAgYWpheC5mZXRjaCh1cmw6IFwiI3tAcm9vdFVybH0je2lkfS5qc29uXCIpLnRoZW4gKHRlYW0pID0+XG4gICAgICBAZGF0YS50ZWFtW2lkXSA9IHRlYW1cblxuICBzdGF0czogLT5cbiAgICBhamF4LmZldGNoKHVybDogXCIje0Byb290VXJsfXN0YXRzLmpzb25cIikudGhlbiAoc3RhdHMpID0+XG4gICAgICBAZGF0YS5zdGF0cyA9IHN0YXRzXG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblEgPSByZXF1aXJlICdxJ1xuXG5JbmRleFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2luZGV4J1xuVGVhbVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3RlYW0nXG5QbGF5ZXJWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9wbGF5ZXInXG5cbm1vZHVsZS5leHBvcnRzID0gKGFqYXgpIC0+XG4gIFN0b3JlID0gcmVxdWlyZShcIi4vbGliL3N0b3JlXCIpKGFqYXgpXG5cbiAgXCIvXCI6IC0+XG4gICAgIyBUT0RPOiB3aGVuIHJlcXVpcmVkIHN0b3JlcyBmb3IgZnJvbnQgcGFnZSBhcmUgbG9hZGVkLFxuICAgICMgc3RhcnQgbG9hZGluZyBvdGhlciBmcmVxdWVudGx5IGFjY2Vzc2VkIHN0b3Jlc1xuICAgICMgaW4gYmFja2dyb3VuZCwgc28gdGhleSdyZSBpbiBjYWNoZSB3aGVuIG5lZWRlZFxuICAgIFEuc3ByZWFkKFtTdG9yZS5nZXQoXCJ0ZWFtc1wiKSwgU3RvcmUuZ2V0KFwic3RhdHNcIildLCAodGVhbXNMaXN0LCBzdGF0c0xpc3QpIC0+XG4gICAgICB0aXRsZTogXCJFdHVzaXZ1XCJcbiAgICAgIGNvbXBvbmVudDogSW5kZXhWaWV3KHRlYW1zOiB0ZWFtc0xpc3QsIHN0YXRzOiBzdGF0c0xpc3QpXG4gICAgKVxuXG4gIFwiL2pvdWtrdWVldC86aWRcIjogKGlkKSAtPlxuICAgIFEuc3ByZWFkKFtTdG9yZS5nZXQoXCJ0ZWFtc1wiKSwgU3RvcmUuZ2V0KFwidGVhbVwiLCBpZCldLCAodGVhbXNMaXN0LCB0ZWFtKSAtPlxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0IC0gI3tpZH1cIlxuICAgICAgY29tcG9uZW50OiBUZWFtVmlldyhpZDogaWQsIHRlYW1zOiB0ZWFtc0xpc3QsIHRlYW06IHRlYW0pXG4gICAgKVxuXG4gIFwiL2pvdWtrdWVldC86aWQvOnBpZC86c2x1Z1wiOiAoaWQsIHBpZCkgLT5cbiAgICBTdG9yZS5nZXQoXCJ0ZWFtXCIsIGlkKS50aGVuICh0ZWFtKSAtPlxuICAgICAgdGl0bGU6IFwiUGVsYWFqYXQgLSAje3BpZH1cIlxuICAgICAgY29tcG9uZW50OiBQbGF5ZXJWaWV3KGlkOiBwaWQsIHRlYW1JZDogaWQsIHRlYW06IHRlYW0pIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5jbGFzc1NldCA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldFxuXG5Ecm9wZG93biA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIG9wZW46IGZhbHNlXG5cbiAgdG9nZ2xlT3BlbjogKGV2ZW50KSAtPlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBAc2V0U3RhdGUgb3Blbjogbm90IEBzdGF0ZS5vcGVuXG5cbiAgY2xvc2U6IChldmVudCkgLT5cbiAgICBAc2V0U3RhdGUgb3BlbjogZmFsc2VcblxuICByZW5kZXI6IC0+XG4gICAgY2xhc3NlcyA9IGNsYXNzU2V0XG4gICAgICAnb3Blbic6IEBzdGF0ZS5vcGVuXG4gICAgICAnZHJvcGRvd24nOiB0cnVlXG5cbiAgICBSZWFjdC5ET00ubGkoe1wiY2xhc3NOYW1lXCI6IChjbGFzc2VzKX0sIFxuICAgICAgUmVhY3QuRE9NLmEoe1wicm9sZVwiOiBcImJ1dHRvblwiLCBcImhyZWZcIjogXCIjXCIsIFwib25DbGlja1wiOiAoQHRvZ2dsZU9wZW4pfSwgKEBwcm9wcy50aXRsZSksIFwiIFwiLCBSZWFjdC5ET00uc3Bhbih7XCJjbGFzc05hbWVcIjogXCJjYXJldFwifSkpLCBcbiAgICAgIFJlYWN0LkRPTS51bCh7XCJjbGFzc05hbWVcIjogXCJkcm9wZG93bi1tZW51XCIsIFwicm9sZVwiOiBcIm1lbnVcIn0sIFxuICAgICAgICAoQHByb3BzLml0ZW1zLm1hcCAoaXRlbSkgPT5cbiAgICAgICAgICBSZWFjdC5ET00ubGkoe1wicm9sZVwiOiBcInByZXNlbnRhdGlvblwiLCBcImtleVwiOiAoaXRlbS50aXRsZSl9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5hKHtcInJvbGVcIjogXCJtZW51aXRlbVwiLCBcInRhYkluZGV4XCI6IFwiLTFcIiwgXCJocmVmXCI6IChpdGVtLnVybCksIFwib25DbGlja1wiOiAoQGNsb3NlKX0sIChpdGVtLnRpdGxlKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcGRvd24iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5UZWFtc0xpc3RWaWV3ID0gcmVxdWlyZSAnLi90ZWFtc19saXN0J1xuXG5JbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICBOYXZpZ2F0aW9uKG51bGwpLCBcblxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJqdW1ib3Ryb25cIn0sIFxuICAgICAgICBSZWFjdC5ET00uaDEobnVsbCwgXCJMaWlnYS5wd1wiKSwgXG4gICAgICAgIFJlYWN0LkRPTS5wKG51bGwsIFwiS2Fpa2tpIExpaWdhc3RhIG5vcGVhc3RpIGphIHZhaXZhdHRvbWFzdGlcIilcbiAgICAgICksIFxuXG4gICAgICBUZWFtc0xpc3RWaWV3KHtcInRlYW1zXCI6IChAcHJvcHMudGVhbXMpLCBcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMpfSlcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gSW5kZXgiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbkRyb3Bkb3duID0gcmVxdWlyZSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duJ1xuXG57TmF2YmFyLCBOYXYsIE5hdkl0ZW0sIERyb3Bkb3duQnV0dG9uLCBNZW51SXRlbX0gPSByZXF1aXJlIFwicmVhY3QtYm9vdHN0cmFwXCJcblxuTmF2aWdhdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIGJyYW5kID0gUmVhY3QuRE9NLmEoe1wiaHJlZlwiOiBcIi9cIiwgXCJjbGFzc05hbWVcIjogXCJuYXZiYXItYnJhbmRcIn0sIFwiTGlpZ2FcIilcblxuICAgIGlmIEBwcm9wcy5kcm9wZG93blxuICAgICAgZHJvcGRvd24gPSBEcm9wZG93bkJ1dHRvbih7XCJ0aXRsZVwiOiAoQHByb3BzLmRyb3Bkb3duLnRpdGxlKSwgXCJvblNlbGVjdFwiOiAoLT4pfSwgXG4gICAgICAgIChAcHJvcHMuZHJvcGRvd24uaXRlbXMubWFwIChpdGVtKSAtPlxuICAgICAgICAgIE1lbnVJdGVtKHtcImtleVwiOiAoaXRlbS50aXRsZSksIFwiaHJlZlwiOiAoaXRlbS51cmwpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICApXG4gICAgICApXG5cbiAgICBOYXZiYXIoe1wiYnJhbmRcIjogKGJyYW5kKSwgXCJmaXhlZFRvcFwiOiB0cnVlLCBcInRvZ2dsZU5hdktleVwiOiAoMCl9LCBcbiAgICAgIE5hdih7XCJjbGFzc05hbWVcIjogXCJicy1uYXZiYXItY29sbGFwc2VcIiwgXCJrZXlcIjogKDApLCBcInJvbGVcIjogXCJuYXZpZ2F0aW9uXCJ9LCBcbiAgICAgICAgKGRyb3Bkb3duKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBOYXZpZ2F0aW9uIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cbkRyb3Bkb3duID0gcmVxdWlyZSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuUGxheWVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgdGVhbUlkID0gQHByb3BzLnRlYW1JZFxuICAgIHJvc3RlciA9IEBwcm9wcy50ZWFtLnJvc3RlclxuXG4gICAgcGxheWVycyA9XG4gICAgICB0aXRsZTogXCJQZWxhYWphdFwiLFxuICAgICAgaXRlbXM6IHJvc3Rlci5tYXAgKHBsYXllcikgPT5cbiAgICAgICAgdGl0bGU6IFwiI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgICB1cmw6IFwiL2pvdWtrdWVldC8je3RlYW1JZH0vI3twbGF5ZXIuaWR9XCJcblxuICAgIGNvbnNvbGUubG9nIEBwcm9wcy5pZFxuXG4gICAgcGxheWVyID0gQHByb3BzLnRlYW0ucm9zdGVyLmZpbHRlcigocGxheWVyKSA9PlxuICAgICAgW2lkLCBzbHVnXSA9IHBsYXllci5pZC5zcGxpdChcIi9cIilcbiAgICAgIGlkIGlzIEBwcm9wcy5pZFxuICAgIClbMF1cblxuICAgIGNvbnNvbGUubG9nIFwicGxheWVyXCIsIHBsYXllclxuXG4gICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgIE5hdmlnYXRpb24oe1wiZHJvcGRvd25cIjogKHBsYXllcnMpfSksIFxuXG4gICAgICBSZWFjdC5ET00uaDEobnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5QbGF5ZXJTdGF0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk5hbWVcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkdhbWVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJHb2Fsc1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiQXNzaXN0c1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUG9pbnRzXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQZW5hbHRpZXNcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIitcXHgyRi1cIilcbiAgICAgICAgKVxuICAgICAgKSwgXG4gICAgICAoQHByb3BzLnN0YXRzLm1hcCAocGxheWVyKSAtPlxuICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXFx4M0VcIiwgKHBsYXllci5sYXN0TmFtZSkpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nYW1lcykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nb2FscykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5hc3Npc3RzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBvaW50cykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wZW5hbHRpZXMpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIucGx1c01pbnVzKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJTdGF0cyIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuUGxheWVyU3RhdHMgPSByZXF1aXJlICcuL3BsYXllcl9zdGF0cydcblRlYW1TY2hlZHVsZSA9IHJlcXVpcmUgJy4vdGVhbV9zY2hlZHVsZSdcblRlYW1Sb3N0ZXIgPSByZXF1aXJlICcuL3RlYW1fcm9zdGVyJ1xuRHJvcGRvd24gPSByZXF1aXJlICcuL2NvbXBvbmVudHMvZHJvcGRvd24nXG5OYXZpZ2F0aW9uID0gcmVxdWlyZSAnLi9uYXZpZ2F0aW9uJ1xuXG5UZWFtID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgdGVhbXMgPVxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0XCIsXG4gICAgICBpdGVtczogQHByb3BzLnRlYW1zLm1hcCAodGVhbSkgLT5cbiAgICAgICAgdGl0bGU6IHRlYW0ubmFtZVxuICAgICAgICB1cmw6IHRlYW0udXJsXG5cbiAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgTmF2aWdhdGlvbih7XCJkcm9wZG93blwiOiAodGVhbXMpfSksIFxuXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcInRlYW1cIn0sIFxuICAgICAgICBSZWFjdC5ET00uaDEobnVsbCwgKEBwcm9wcy50ZWFtLmluZm8ubmFtZSkpLCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0ZWFtLWNvbnRhaW5lclwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnVsKG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmxpKG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmxvbmdOYW1lKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmxpKG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmFkZHJlc3MpKSwgXG4gICAgICAgICAgICBSZWFjdC5ET00ubGkobnVsbCwgKEBwcm9wcy50ZWFtLmluZm8uZW1haWwpKVxuICAgICAgICAgICksIFxuICAgICAgICAgIFJlYWN0LkRPTS5hKHtcImhyZWZcIjogKEBwcm9wcy50ZWFtLmluZm8udGlja2V0c1VybCl9LCBcIkxpcHV0XCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00uYSh7XCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLmxvY2F0aW9uVXJsKX0sIFwiSGFsbGluIHNpamFpbnRpXCIpXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIk90dGVsdXRcIiksIFxuICAgICAgICBUZWFtU2NoZWR1bGUoe1wic2NoZWR1bGVcIjogKEBwcm9wcy50ZWFtLnNjaGVkdWxlKX0pLCBcblxuICAgICAgICBSZWFjdC5ET00uaDEobnVsbCwgXCJQZWxhYWphdFwiKSwgXG4gICAgICAgIFRlYW1Sb3N0ZXIoe1widGVhbUlkXCI6IChAcHJvcHMuaWQpLCBcInJvc3RlclwiOiAoQHByb3BzLnRlYW0ucm9zdGVyKX0pXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW0iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVGVhbUl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00uYSh7XCJjbGFzc05hbWVcIjogXCJ0ZWFtICN7QHByb3BzLnRlYW0uaWR9IGJ0biBidG4tZGVmYXVsdCBidG4tbGcgYnRuLWJsb2NrXCIsIFwiaHJlZlwiOiBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbS5pZH1cIn0sIFxuICAgICAgKEBwcm9wcy50ZWFtLm5hbWUpXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1JdGVtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRlYW1Sb3N0ZXIgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSwgXG4gICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOaW1pXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOdW1lcm9cIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBpdHV1c1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUGFpbm9cIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIktcXHUwMGU0dGlzeXlzXCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKEBwcm9wcy5yb3N0ZXIubWFwIChwbGF5ZXIpID0+XG4gICAgICAgIHVybCA9IFwiL2pvdWtrdWVldC8je0Bwcm9wcy50ZWFtSWR9LyN7cGxheWVyLmlkfVwiXG4gICAgICAgIHRpdGxlID0gXCIje3BsYXllci5maXJzdE5hbWV9ICN7cGxheWVyLmxhc3ROYW1lfVwiXG4gICAgICAgIFJlYWN0LkRPTS50cih7XCJrZXlcIjogKHBsYXllci5pZCl9LCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgUmVhY3QuRE9NLmEoe1wiaHJlZlwiOiAodXJsKX0sICh0aXRsZSkpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIubnVtYmVyKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmhlaWdodCkpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci53ZWlnaHQpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuc2hvb3RzKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtUm9zdGVyIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5cblRlYW1TY2hlZHVsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBcXHUwMGU0aXZcXHUwMGU0bVxcdTAwZTRcXHUwMGU0clxcdTAwZTRcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkpvdWtrdWVldFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiVHVsb3NcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIllsZWlzXFx1MDBmNm1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKEBwcm9wcy5zY2hlZHVsZS5tYXAgKG1hdGNoLCBpKSAtPlxuICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChtYXRjaC5pZCl9LCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKG1vbWVudChtYXRjaC5kYXRlKS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpKSwgXCIgXCIsIChtYXRjaC50aW1lKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobWF0Y2guaG9tZSksIFwiIC0gXCIsIChtYXRjaC52aXNpdG9yKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobWF0Y2guaG9tZVNjb3JlKSwgXCItXCIsIChtYXRjaC52aXNpdG9yU2NvcmUpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChtYXRjaC5hdHRlbmRhbmNlKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtU2NoZWR1bGUiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblRlYW1JdGVtID0gcmVxdWlyZSAnLi90ZWFtX2l0ZW0nXG5Ub3BTY29yZXJzID0gcmVxdWlyZSAnLi90b3Bfc2NvcmVycydcblxuVGVhbXNMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJyb3dcIn0sIFxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0ZWFtc192aWV3IGNvbC14cy0xMiBjb2wtc20tNlwifSwgXG4gICAgICAgIChAcHJvcHMudGVhbXMubWFwICh0ZWFtKSAtPiBUZWFtSXRlbShrZXk6IHRlYW0uaWQsIHRlYW06IHRlYW0pKVxuICAgICAgKSwgXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcImNvbC14cy0xMiBjb2wtc20tNlwifSwgXG4gICAgICAgIFRvcFNjb3JlcnMoe1wic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtc0xpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuVG9wU2NvcmVycyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS50YWJsZSh7XCJjbGFzc05hbWVcIjogXCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJ9LCBcbiAgICAgIFJlYWN0LkRPTS50aGVhZChudWxsLCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk5pbWlcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk90dGVsdXRcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIk1hYWxpdFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiU3lcXHUwMGY2dFxcdTAwZjZ0XCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQaXN0ZWV0XCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKEBwcm9wcy5zdGF0cy5zY29yaW5nU3RhdHMuZmlsdGVyIChwbGF5ZXIsIGluZGV4KSAtPlxuICAgICAgICBpbmRleCA8IDIwXG4gICAgICAubWFwIChwbGF5ZXIpIC0+XG4gICAgICAgIFJlYWN0LkRPTS50cih7XCJrZXlcIjogKHBsYXllci5pZCl9LCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5maXJzdE5hbWUpLCBcIiBcIiwgKHBsYXllci5sYXN0TmFtZSkpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nYW1lcykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5nb2FscykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5hc3Npc3RzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBvaW50cykpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVG9wU2NvcmVycyJdfQ==
