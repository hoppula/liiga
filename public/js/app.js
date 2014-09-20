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
var Dropdown, Navigation, React;

React = require('react/addons');

Dropdown = require('./components/dropdown');

Navigation = React.createClass({
  render: function() {
    return React.DOM.div({
      "className": "navbar navbar-default navbar-fixed-top",
      "role": "navigation"
    }, React.DOM.div({
      "className": "container"
    }, React.DOM.div({
      "className": "navbar-header"
    }, React.DOM.a({
      "href": "/",
      "className": "navbar-brand"
    }, "Liiga")), React.DOM.div({
      "className": "navbar-collapse collapse"
    }, React.DOM.ul({
      "className": "nav navbar-nav"
    }, (this.props.dropdown ? Dropdown({
      "title": this.props.dropdown.title,
      "items": this.props.dropdown.items
    }) : void 0)))));
  }
});

module.exports = Navigation;



},{"./components/dropdown":"/Users/hoppula/repos/liiga_frontend/views/components/dropdown.coffee","react/addons":"react/addons"}],"/Users/hoppula/repos/liiga_frontend/views/player.coffee":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9jbGllbnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvbGliL2FqYXguY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvbGliL3N0b3JlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3JvdXRlcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9jb21wb25lbnRzL2Ryb3Bkb3duLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL2luZGV4LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL25hdmlnYXRpb24uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvcGxheWVyLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3BsYXllcl9zdGF0cy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1faXRlbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3Jvc3Rlci5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX3NjaGVkdWxlLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3ZpZXdzL3RlYW1zX2xpc3QuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdG9wX3Njb3JlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxtREFBQTs7QUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FBWCxDQUFBOztBQUFBLEtBQ0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQURSLENBQUE7O0FBQUEsWUFLQSxHQUFlLE9BQUEsQ0FBUSxVQUFSLENBQUEsQ0FBb0IsT0FBQSxDQUFRLFlBQVIsQ0FBcEIsQ0FMZixDQUFBOztBQUFBLFlBT0EsR0FBZSxRQUFRLENBQUMsY0FBVCxDQUF3QixLQUF4QixDQVBmLENBQUE7O0FBQUEsTUFTQSxHQUFTLFNBQUMsT0FBRCxHQUFBOztJQUFDLFVBQVE7R0FDaEI7QUFBQSxFQUFBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQWhCLEVBQWtCLENBQWxCLENBQUEsQ0FBQTtBQUFBLEVBQ0EsUUFBUSxDQUFDLG9CQUFULENBQThCLE9BQTlCLENBQXVDLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBMUMsR0FBc0QsT0FBTyxDQUFDLEtBRDlELENBQUE7U0FFQSxLQUFLLENBQUMsZUFBTixDQUFzQixPQUFPLENBQUMsU0FBOUIsRUFBeUMsWUFBekMsRUFITztBQUFBLENBVFQsQ0FBQTs7QUFBQSxRQWNRLENBQUMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFNBQUEsR0FBQTtBQUM1QyxNQUFBLDBCQUFBO0FBQUEsRUFBQSxLQUFLLENBQUMscUJBQU4sQ0FBNEIsSUFBNUIsQ0FBQSxDQUFBO0FBQUEsRUFFQSxNQUFBLEdBQVMsUUFBUSxDQUFDLE1BQVQsQ0FBQSxDQUFpQixDQUFDLFNBQWxCLENBQTRCO0FBQUEsSUFBQSxZQUFBLEVBQWMsSUFBZDtHQUE1QixDQUZULENBQUE7QUFJQSxRQUNLLFNBQUMsS0FBRCxFQUFRLE1BQVIs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QmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZGlyZWN0b3IgPSByZXF1aXJlICdkaXJlY3RvcidcblJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG4jIHNoYXJlZCByb3V0ZXMgYmV0d2VlbiBjbGllbnQgJiBzZXJ2ZXIsIGJhc2ljYWxseSBhbGwgcHVibGljXG4jIEdFVCByb3V0ZXMgdGhhdCBzaG91bGQgZ2V0IGluZGV4ZWQgYnkgc2VhcmNoIGVuZ2luZXNcbnNoYXJlZFJvdXRlcyA9IHJlcXVpcmUoJy4vcm91dGVzJykocmVxdWlyZSgnLi9saWIvYWpheCcpKVxuXG5hcHBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnYXBwJ1xuXG5yZW5kZXIgPSAob3B0aW9ucz17fSkgLT5cbiAgd2luZG93LnNjcm9sbFRvKDAsMClcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0aXRsZVwiKVswXS5pbm5lckhUTUwgPSBvcHRpb25zLnRpdGxlXG4gIFJlYWN0LnJlbmRlckNvbXBvbmVudChvcHRpb25zLmNvbXBvbmVudCwgYXBwQ29udGFpbmVyKVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwiRE9NQ29udGVudExvYWRlZFwiLCAtPlxuICBSZWFjdC5pbml0aWFsaXplVG91Y2hFdmVudHModHJ1ZSlcblxuICByb3V0ZXIgPSBkaXJlY3Rvci5Sb3V0ZXIoKS5jb25maWd1cmUoaHRtbDVoaXN0b3J5OiB0cnVlKVxuXG4gIGZvciByb3V0ZSwgYWN0aW9uIG9mIHNoYXJlZFJvdXRlc1xuICAgIGRvIChyb3V0ZSwgYWN0aW9uKSAtPlxuICAgICAgcm91dGVyLm9uIHJvdXRlLCAtPlxuICAgICAgICBhY3Rpb24uYXBwbHkoQCwgYXJndW1lbnRzKS50aGVuIChvcHRpb25zKSAtPlxuICAgICAgICAgIHJlbmRlcihvcHRpb25zKVxuICAgICAgICAuZmFpbCAoZXJyb3IpIC0+XG4gICAgICAgICAgY29uc29sZS5sb2cgXCJlcnJvclwiLCBlcnJvclxuICAgICAgICAuZG9uZSgpXG5cbiAgcm91dGVyLmluaXQoKVxuXG4gICMgVE9ETzogbG9hZCBhbGwgdGVhbSBkYXRhIGluIG9uZSBiaWcgcmVxdWVzdCxcbiAgIyBzdGFydCBsb2FkaW5nIGNvbmN1cnJlbnRseSB3aXRoIHRlYW1zLmpzb25cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIChldmVudCkgLT5cbiAgICB0YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBocmVmID0gdGFyZ2V0LmhyZWZcbiAgICBwcm90b2NvbCA9IFwiI3t0YXJnZXQucHJvdG9jb2x9Ly9cIlxuXG4gICAgIyByb3V0ZSBvbmx5IGxvY2FsIGxpbmtzIHdpdGggd2VsbCBkZWZpbmVkIHJlbGF0aXZlIHBhdGhzXG4gICAgbG9jYWwgPSBkb2N1bWVudC5sb2NhdGlvbi5ob3N0IGlzIHRhcmdldC5ob3N0XG4gICAgcmVsYXRpdmVVcmwgPSBocmVmPy5zbGljZShwcm90b2NvbC5sZW5ndGgrdGFyZ2V0Lmhvc3QubGVuZ3RoKVxuICAgIHByb3BlckxvY2FsID0gbG9jYWwgYW5kIHJlbGF0aXZlVXJsLm1hdGNoKC9eXFwvLykgYW5kIG5vdCByZWxhdGl2ZVVybC5tYXRjaCgvIyQvKVxuXG4gICAgaWYgcHJvcGVyTG9jYWwgYW5kIG5vdCBldmVudC5hbHRLZXkgYW5kIG5vdCBldmVudC5jdHJsS2V5IGFuZCBub3QgZXZlbnQubWV0YUtleSBhbmQgbm90IGV2ZW50LnNoaWZ0S2V5XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByb3V0ZXIuc2V0Um91dGUgdGFyZ2V0LmhyZWZcblxuXG5cbiIsIlEgPSByZXF1aXJlICdxJ1xucmVxdWVzdCA9IHJlcXVpcmUgJ2Jyb3dzZXItcmVxdWVzdCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBlbnZpcm9ubWVudDogXCJicm93c2VyXCJcblxuICBmZXRjaDogKG9wdGlvbnMpIC0+XG4gICAgZGVmZXJyZWQgPSBRLmRlZmVyKClcblxuICAgIG9wdHMgPVxuICAgICAgdXJsOiBvcHRpb25zLnVybFxuICAgICAgbWV0aG9kOiBvcHRpb25zLm1ldGhvZCBvciBcIkdFVFwiXG4gICAgICBqc29uOiB0cnVlXG5cbiAgICBvcHRzLmJvZHkgaWYgb3B0aW9ucy5kYXRhXG5cbiAgICByZXF1ZXN0IG9wdHMsIChlcnIsIHJlc3AsIGJvZHkpIC0+XG4gICAgICBpZiBlcnJcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycilcbiAgICAgICAgb3B0aW9ucy5lcnJvcihlcnIpIGlmIG9wdGlvbnMuZXJyb3JcbiAgICAgIGVsc2VcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShib2R5KVxuICAgICAgICBvcHRpb25zLnN1Y2Nlc3MoYm9keSkgaWYgb3B0aW9ucy5zdWNjZXNzXG5cbiAgICBkZWZlcnJlZC5wcm9taXNlIiwiUSA9IHJlcXVpcmUgJ3EnXG5cblN0b3JlID0gKGFqYXgpIC0+XG4gIHJvb3RVcmw6IFwiaHR0cDovLzE5Mi4xNjguMTEuNjo0MDAwL2pzb24vXCJcblxuICBkYXRhOlxuICAgIHRlYW06IHt9XG5cbiAgZ2V0OiAobWV0aG9kLCBwYXJhbXMuLi4pIC0+XG4gICAgIyBpZiBydW5uaW5nIG9uIHNlcnZlciwgZG8gbm90IGNhY2hlIHJlcXVlc3RzXG4gICAgaWYgYWpheC5lbnZpcm9ubWVudCBpcyBcInNlcnZlclwiXG4gICAgICBAW21ldGhvZF0ocGFyYW1zKVxuICAgIGVsc2VcbiAgICAgICMgVE9ETzogYmV0dGVyIGNhY2hpbmdcbiAgICAgIGlmIEBkYXRhW21ldGhvZF1cbiAgICAgICAgaWYgcGFyYW1zLmxlbmd0aCBpc250IDBcbiAgICAgICAgICBpZiBAZGF0YVttZXRob2RdW3BhcmFtc1swXV1cbiAgICAgICAgICAgIFEoQGRhdGFbbWV0aG9kXVtwYXJhbXNbMF1dKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBbbWV0aG9kXShwYXJhbXMpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBRKEBkYXRhW21ldGhvZF0pXG4gICAgICBlbHNlXG4gICAgICAgIEBbbWV0aG9kXShwYXJhbXMpXG5cbiAgdGVhbXM6IC0+XG4gICAgYWpheC5mZXRjaCh1cmw6IFwiI3tAcm9vdFVybH10ZWFtcy5qc29uXCIpLnRoZW4gKHRlYW1zKSA9PlxuICAgICAgQGRhdGEudGVhbXMgPSB0ZWFtc1xuXG4gIHRlYW06IChpZCkgLT5cbiAgICBhamF4LmZldGNoKHVybDogXCIje0Byb290VXJsfSN7aWR9Lmpzb25cIikudGhlbiAodGVhbSkgPT5cbiAgICAgIEBkYXRhLnRlYW1baWRdID0gdGVhbVxuXG4gIHN0YXRzOiAtPlxuICAgIGFqYXguZmV0Y2godXJsOiBcIiN7QHJvb3RVcmx9c3RhdHMuanNvblwiKS50aGVuIChzdGF0cykgPT5cbiAgICAgIEBkYXRhLnN0YXRzID0gc3RhdHNcblxubW9kdWxlLmV4cG9ydHMgPSBTdG9yZSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuUSA9IHJlcXVpcmUgJ3EnXG5cbkluZGV4VmlldyA9IHJlcXVpcmUgJy4vdmlld3MvaW5kZXgnXG5UZWFtVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvdGVhbSdcblBsYXllclZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3BsYXllcidcblxubW9kdWxlLmV4cG9ydHMgPSAoYWpheCkgLT5cbiAgU3RvcmUgPSByZXF1aXJlKFwiLi9saWIvc3RvcmVcIikoYWpheClcblxuICBcIi9cIjogLT5cbiAgICAjIFRPRE86IHdoZW4gcmVxdWlyZWQgc3RvcmVzIGZvciBmcm9udCBwYWdlIGFyZSBsb2FkZWQsXG4gICAgIyBzdGFydCBsb2FkaW5nIG90aGVyIGZyZXF1ZW50bHkgYWNjZXNzZWQgc3RvcmVzXG4gICAgIyBpbiBiYWNrZ3JvdW5kLCBzbyB0aGV5J3JlIGluIGNhY2hlIHdoZW4gbmVlZGVkXG4gICAgUS5zcHJlYWQoW1N0b3JlLmdldChcInRlYW1zXCIpLCBTdG9yZS5nZXQoXCJzdGF0c1wiKV0sICh0ZWFtc0xpc3QsIHN0YXRzTGlzdCkgLT5cbiAgICAgIHRpdGxlOiBcIkV0dXNpdnVcIlxuICAgICAgY29tcG9uZW50OiBJbmRleFZpZXcodGVhbXM6IHRlYW1zTGlzdCwgc3RhdHM6IHN0YXRzTGlzdClcbiAgICApXG5cbiAgXCIvam91a2t1ZWV0LzppZFwiOiAoaWQpIC0+XG4gICAgUS5zcHJlYWQoW1N0b3JlLmdldChcInRlYW1zXCIpLCBTdG9yZS5nZXQoXCJ0ZWFtXCIsIGlkKV0sICh0ZWFtc0xpc3QsIHRlYW0pIC0+XG4gICAgICB0aXRsZTogXCJKb3Vra3VlZXQgLSAje2lkfVwiXG4gICAgICBjb21wb25lbnQ6IFRlYW1WaWV3KGlkOiBpZCwgdGVhbXM6IHRlYW1zTGlzdCwgdGVhbTogdGVhbSlcbiAgICApXG5cbiAgXCIvam91a2t1ZWV0LzppZC86cGlkLzpzbHVnXCI6IChpZCwgcGlkKSAtPlxuICAgIFN0b3JlLmdldChcInRlYW1cIiwgaWQpLnRoZW4gKHRlYW0pIC0+XG4gICAgICB0aXRsZTogXCJQZWxhYWphdCAtICN7cGlkfVwiXG4gICAgICBjb21wb25lbnQ6IFBsYXllclZpZXcoaWQ6IHBpZCwgdGVhbUlkOiBpZCwgdGVhbTogdGVhbSkiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcbmNsYXNzU2V0ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0XG5cbkRyb3Bkb3duID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgb3BlbjogZmFsc2VcblxuICB0b2dnbGVPcGVuOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIEBzZXRTdGF0ZSBvcGVuOiBub3QgQHN0YXRlLm9wZW5cblxuICBjbG9zZTogKGV2ZW50KSAtPlxuICAgIEBzZXRTdGF0ZSBvcGVuOiBmYWxzZVxuXG4gIHJlbmRlcjogLT5cbiAgICBjbGFzc2VzID0gY2xhc3NTZXRcbiAgICAgICdvcGVuJzogQHN0YXRlLm9wZW5cbiAgICAgICdkcm9wZG93bic6IHRydWVcblxuICAgIFJlYWN0LkRPTS5saSh7XCJjbGFzc05hbWVcIjogKGNsYXNzZXMpfSwgXG4gICAgICBSZWFjdC5ET00uYSh7XCJyb2xlXCI6IFwiYnV0dG9uXCIsIFwiaHJlZlwiOiBcIiNcIiwgXCJvbkNsaWNrXCI6IChAdG9nZ2xlT3Blbil9LCAoQHByb3BzLnRpdGxlKSwgXCIgXCIsIFJlYWN0LkRPTS5zcGFuKHtcImNsYXNzTmFtZVwiOiBcImNhcmV0XCJ9KSksIFxuICAgICAgUmVhY3QuRE9NLnVsKHtcImNsYXNzTmFtZVwiOiBcImRyb3Bkb3duLW1lbnVcIiwgXCJyb2xlXCI6IFwibWVudVwifSwgXG4gICAgICAgIChAcHJvcHMuaXRlbXMubWFwIChpdGVtKSA9PlxuICAgICAgICAgIFJlYWN0LkRPTS5saSh7XCJyb2xlXCI6IFwicHJlc2VudGF0aW9uXCIsIFwia2V5XCI6IChpdGVtLnRpdGxlKX0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmEoe1wicm9sZVwiOiBcIm1lbnVpdGVtXCIsIFwidGFiSW5kZXhcIjogXCItMVwiLCBcImhyZWZcIjogKGl0ZW0udXJsKSwgXCJvbkNsaWNrXCI6IChAY2xvc2UpfSwgKGl0ZW0udGl0bGUpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93biIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblRlYW1zTGlzdFZpZXcgPSByZXF1aXJlICcuL3RlYW1zX2xpc3QnXG5cbkluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgIE5hdmlnYXRpb24obnVsbCksIFxuXG4gICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcImp1bWJvdHJvblwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5oMShudWxsLCBcIkxpaWdhLnB3XCIpLCBcbiAgICAgICAgUmVhY3QuRE9NLnAobnVsbCwgXCJLYWlra2kgTGlpZ2FzdGEgbm9wZWFzdGkgamEgdmFpdmF0dG9tYXN0aVwiKVxuICAgICAgKSwgXG5cbiAgICAgIFRlYW1zTGlzdFZpZXcoe1widGVhbXNcIjogKEBwcm9wcy50ZWFtcyksIFwic3RhdHNcIjogKEBwcm9wcy5zdGF0cyl9KVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBJbmRleCIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuRHJvcGRvd24gPSByZXF1aXJlICcuL2NvbXBvbmVudHMvZHJvcGRvd24nXG5cbk5hdmlnYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wXCIsIFwicm9sZVwiOiBcIm5hdmlnYXRpb25cIn0sIFxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJjb250YWluZXJcIn0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcIm5hdmJhci1oZWFkZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5hKHtcImhyZWZcIjogXCIvXCIsIFwiY2xhc3NOYW1lXCI6IFwibmF2YmFyLWJyYW5kXCJ9LCBcIkxpaWdhXCIpXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5ET00uZGl2KHtcImNsYXNzTmFtZVwiOiBcIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnVsKHtcImNsYXNzTmFtZVwiOiBcIm5hdiBuYXZiYXItbmF2XCJ9LCBcbiAgICAgICAgICAgIChEcm9wZG93bih7XCJ0aXRsZVwiOiAoQHByb3BzLmRyb3Bkb3duLnRpdGxlKSwgXCJpdGVtc1wiOiAoQHByb3BzLmRyb3Bkb3duLml0ZW1zKX0pIGlmIEBwcm9wcy5kcm9wZG93bilcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbiIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5Ecm9wZG93biA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy9kcm9wZG93bidcbk5hdmlnYXRpb24gPSByZXF1aXJlICcuL25hdmlnYXRpb24nXG5cblBsYXllciA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIHRlYW1JZCA9IEBwcm9wcy50ZWFtSWRcbiAgICByb3N0ZXIgPSBAcHJvcHMudGVhbS5yb3N0ZXJcblxuICAgIHBsYXllcnMgPVxuICAgICAgdGl0bGU6IFwiUGVsYWFqYXRcIixcbiAgICAgIGl0ZW1zOiByb3N0ZXIubWFwIChwbGF5ZXIpID0+XG4gICAgICAgIHRpdGxlOiBcIiN7cGxheWVyLmZpcnN0TmFtZX0gI3twbGF5ZXIubGFzdE5hbWV9XCJcbiAgICAgICAgdXJsOiBcIi9qb3Vra3VlZXQvI3t0ZWFtSWR9LyN7cGxheWVyLmlkfVwiXG5cbiAgICBjb25zb2xlLmxvZyBAcHJvcHMuaWRcblxuICAgIHBsYXllciA9IEBwcm9wcy50ZWFtLnJvc3Rlci5maWx0ZXIoKHBsYXllcikgPT5cbiAgICAgIFtpZCwgc2x1Z10gPSBwbGF5ZXIuaWQuc3BsaXQoXCIvXCIpXG4gICAgICBpZCBpcyBAcHJvcHMuaWRcbiAgICApWzBdXG5cbiAgICBjb25zb2xlLmxvZyBcInBsYXllclwiLCBwbGF5ZXJcblxuICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICBOYXZpZ2F0aW9uKHtcImRyb3Bkb3duXCI6IChwbGF5ZXJzKX0pLCBcblxuICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXIiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblxuUGxheWVyU3RhdHMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSwgXG4gICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOYW1lXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJHYW1lc1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiR29hbHNcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIkFzc2lzdHNcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBvaW50c1wiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUGVuYWx0aWVzXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCIrXFx4MkYtXCIpXG4gICAgICAgIClcbiAgICAgICksIFxuICAgICAgKEBwcm9wcy5zdGF0cy5tYXAgKHBsYXllcikgLT5cbiAgICAgICAgUmVhY3QuRE9NLnRyKHtcImtleVwiOiAocGxheWVyLmlkKX0sIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLmZpcnN0TmFtZSksIFwiIFxceDNFXCIsIChwbGF5ZXIubGFzdE5hbWUpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ2FtZXMpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ29hbHMpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wb2ludHMpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIucGVuYWx0aWVzKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnBsdXNNaW51cykpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyU3RhdHMiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0L2FkZG9ucydcblBsYXllclN0YXRzID0gcmVxdWlyZSAnLi9wbGF5ZXJfc3RhdHMnXG5UZWFtU2NoZWR1bGUgPSByZXF1aXJlICcuL3RlYW1fc2NoZWR1bGUnXG5UZWFtUm9zdGVyID0gcmVxdWlyZSAnLi90ZWFtX3Jvc3RlcidcbkRyb3Bkb3duID0gcmVxdWlyZSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duJ1xuTmF2aWdhdGlvbiA9IHJlcXVpcmUgJy4vbmF2aWdhdGlvbidcblxuVGVhbSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIHRlYW1zID1cbiAgICAgIHRpdGxlOiBcIkpvdWtrdWVldFwiLFxuICAgICAgaXRlbXM6IEBwcm9wcy50ZWFtcy5tYXAgKHRlYW0pIC0+XG4gICAgICAgIHRpdGxlOiB0ZWFtLm5hbWVcbiAgICAgICAgdXJsOiB0ZWFtLnVybFxuXG4gICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgIE5hdmlnYXRpb24oe1wiZHJvcGRvd25cIjogKHRlYW1zKX0pLCBcblxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJ0ZWFtXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIChAcHJvcHMudGVhbS5pbmZvLm5hbWUpKSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGVhbS1jb250YWluZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS51bChudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCAoQHByb3BzLnRlYW0uaW5mby5sb25nTmFtZSkpLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5saShudWxsLCAoQHByb3BzLnRlYW0uaW5mby5hZGRyZXNzKSksIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmxpKG51bGwsIChAcHJvcHMudGVhbS5pbmZvLmVtYWlsKSlcbiAgICAgICAgICApLCBcbiAgICAgICAgICBSZWFjdC5ET00uYSh7XCJocmVmXCI6IChAcHJvcHMudGVhbS5pbmZvLnRpY2tldHNVcmwpfSwgXCJMaXB1dFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmEoe1wiaHJlZlwiOiAoQHByb3BzLnRlYW0uaW5mby5sb2NhdGlvblVybCl9LCBcIkhhbGxpbiBzaWphaW50aVwiKVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5ET00uaDEobnVsbCwgXCJPdHRlbHV0XCIpLCBcbiAgICAgICAgVGVhbVNjaGVkdWxlKHtcInNjaGVkdWxlXCI6IChAcHJvcHMudGVhbS5zY2hlZHVsZSl9KSwgXG5cbiAgICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIFwiUGVsYWFqYXRcIiksIFxuICAgICAgICBUZWFtUm9zdGVyKHtcInRlYW1JZFwiOiAoQHByb3BzLmlkKSwgXCJyb3N0ZXJcIjogKEBwcm9wcy50ZWFtLnJvc3Rlcil9KVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRlYW1JdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLmEoe1wiY2xhc3NOYW1lXCI6IFwidGVhbSAje0Bwcm9wcy50ZWFtLmlkfSBidG4gYnRuLWRlZmF1bHQgYnRuLWxnIGJ0bi1ibG9ja1wiLCBcImhyZWZcIjogXCIvam91a2t1ZWV0LyN7QHByb3BzLnRlYW0uaWR9XCJ9LCBcbiAgICAgIChAcHJvcHMudGVhbS5uYW1lKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBUZWFtSXRlbSIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xuXG5UZWFtUm9zdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3NcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuRE9NLnRhYmxlKHtcImNsYXNzTmFtZVwiOiBcInRhYmxlIHRhYmxlLXN0cmlwZWRcIn0sIFxuICAgICAgUmVhY3QuRE9NLnRoZWFkKG51bGwsIFxuICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiTmltaVwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiTnVtZXJvXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQaXR1dXNcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlBhaW5vXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJLXFx1MDBlNHRpc3l5c1wiKVxuICAgICAgICApXG4gICAgICApLCBcbiAgICAgIChAcHJvcHMucm9zdGVyLm1hcCAocGxheWVyKSA9PlxuICAgICAgICB1cmwgPSBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbUlkfS8je3BsYXllci5pZH1cIlxuICAgICAgICB0aXRsZSA9IFwiI3twbGF5ZXIuZmlyc3ROYW1lfSAje3BsYXllci5sYXN0TmFtZX1cIlxuICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIFJlYWN0LkRPTS5hKHtcImhyZWZcIjogKHVybCl9LCAodGl0bGUpKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLm51bWJlcikpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5oZWlnaHQpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIud2VpZ2h0KSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAocGxheWVyLnNob290cykpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVJvc3RlciIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QvYWRkb25zJ1xubW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xuXG5UZWFtU2NoZWR1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSwgXG4gICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJQXFx1MDBlNGl2XFx1MDBlNG1cXHUwMGU0XFx1MDBlNHJcXHUwMGU0XCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJKb3Vra3VlZXRcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlR1bG9zXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJZbGVpc1xcdTAwZjZtXFx1MDBlNFxcdTAwZTRyXFx1MDBlNFwiKVxuICAgICAgICApXG4gICAgICApLCBcbiAgICAgIChAcHJvcHMuc2NoZWR1bGUubWFwIChtYXRjaCwgaSkgLT5cbiAgICAgICAgUmVhY3QuRE9NLnRyKHtcImtleVwiOiAobWF0Y2guaWQpfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChtb21lbnQobWF0Y2guZGF0ZSkuZm9ybWF0KFwiREQuTU0uWVlZWVwiKSksIFwiIFwiLCAobWF0Y2gudGltZSkpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKG1hdGNoLmhvbWUpLCBcIiAtIFwiLCAobWF0Y2gudmlzaXRvcikpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKG1hdGNoLmhvbWVTY29yZSksIFwiLVwiLCAobWF0Y2gudmlzaXRvclNjb3JlKSksIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCAobWF0Y2guYXR0ZW5kYW5jZSkpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVNjaGVkdWxlIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5UZWFtSXRlbSA9IHJlcXVpcmUgJy4vdGVhbV9pdGVtJ1xuVG9wU2NvcmVycyA9IHJlcXVpcmUgJy4vdG9wX3Njb3JlcnMnXG5cblRlYW1zTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwicm93XCJ9LCBcbiAgICAgIFJlYWN0LkRPTS5kaXYoe1wiY2xhc3NOYW1lXCI6IFwidGVhbXNfdmlldyBjb2wteHMtMTIgY29sLXNtLTZcIn0sIFxuICAgICAgICAoQHByb3BzLnRlYW1zLm1hcCAodGVhbSkgLT4gVGVhbUl0ZW0oa2V5OiB0ZWFtLmlkLCB0ZWFtOiB0ZWFtKSlcbiAgICAgICksIFxuICAgICAgUmVhY3QuRE9NLmRpdih7XCJjbGFzc05hbWVcIjogXCJjb2wteHMtMTIgY29sLXNtLTZcIn0sIFxuICAgICAgICBUb3BTY29yZXJzKHtcInN0YXRzXCI6IChAcHJvcHMuc3RhdHMpfSlcbiAgICAgIClcbiAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbXNMaXN0IiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdC9hZGRvbnMnXG5cblRvcFNjb3JlcnMgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5ET00udGFibGUoe1wiY2xhc3NOYW1lXCI6IFwidGFibGUgdGFibGUtc3RyaXBlZFwifSwgXG4gICAgICBSZWFjdC5ET00udGhlYWQobnVsbCwgXG4gICAgICAgIFJlYWN0LkRPTS50cihudWxsLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJOaW1pXCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJPdHRlbHV0XCIpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGgobnVsbCwgXCJNYWFsaXRcIiksIFxuICAgICAgICAgIFJlYWN0LkRPTS50aChudWxsLCBcIlN5XFx1MDBmNnRcXHUwMGY2dFwiKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRoKG51bGwsIFwiUGlzdGVldFwiKVxuICAgICAgICApXG4gICAgICApLCBcbiAgICAgIChAcHJvcHMuc3RhdHMuc2NvcmluZ1N0YXRzLmZpbHRlciAocGxheWVyLCBpbmRleCkgLT5cbiAgICAgICAgaW5kZXggPCAyMFxuICAgICAgLm1hcCAocGxheWVyKSAtPlxuICAgICAgICBSZWFjdC5ET00udHIoe1wia2V5XCI6IChwbGF5ZXIuaWQpfSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZmlyc3ROYW1lKSwgXCIgXCIsIChwbGF5ZXIubGFzdE5hbWUpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ2FtZXMpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuZ29hbHMpKSwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIChwbGF5ZXIuYXNzaXN0cykpLCBcbiAgICAgICAgICBSZWFjdC5ET00udGQobnVsbCwgKHBsYXllci5wb2ludHMpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcFNjb3JlcnMiXX0=
