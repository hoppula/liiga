;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Backbone, React, appContainer, director, events, render, sharedRoutes;

React = require('react');

events = require('events');

director = require('director');

Backbone = require('exoskeleton');

Backbone.ajax = require('./lib/exoskeleton/client_ajax');

sharedRoutes = require('./routes');

appContainer = document.getElementById('app');

render = function(options) {
  if (options == null) {
    options = {};
  }
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
      });
    });
  };
  for (route in sharedRoutes) {
    action = sharedRoutes[route];
    _fn(route, action);
  }
  router.init();
  return events.on("navigate", function(url) {
    return router.setRoute(url);
  });
});


},{"./lib/exoskeleton/client_ajax":5,"./routes":7,"director":"Me1FqV","events":4,"exoskeleton":"xaFiq/","react":"xT97vT"}],2:[function(require,module,exports){
var Backbone, TeamModel, TeamsCollection;

Backbone = require('exoskeleton');

TeamModel = require('../models/team');

TeamsCollection = Backbone.Collection.extend({
  url: "http://192.168.11.6:4000/json/teams.json",
  model: TeamModel
});

module.exports = TeamsCollection;


},{"../models/team":6,"exoskeleton":"xaFiq/"}],3:[function(require,module,exports){
var TeamsCollection, teamsCollection;

TeamsCollection = require('../../collections/teams');

teamsCollection = new TeamsCollection([]);

teamsCollection.fetched = teamsCollection.fetch();

module.exports = teamsCollection;


},{"../../collections/teams":2}],4:[function(require,module,exports){
var Backbone;

Backbone = require('exoskeleton');

module.exports = Backbone.extend(Backbone.Events);


},{"exoskeleton":"xaFiq/"}],5:[function(require,module,exports){
var Q, request;

Q = require('q');

request = require('browser-request');

module.exports = function(options) {
  var deferred, opts;
  deferred = Q.defer();
  opts = {
    url: options.url,
    method: options.type || "GET",
    json: options.dataType === "json"
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
};


},{"browser-request":"GeoHbi","q":"Y51EY2"}],6:[function(require,module,exports){
var Backbone, TeamModel;

Backbone = require('exoskeleton');

TeamModel = Backbone.Model.extend({});

module.exports = TeamModel;


},{"exoskeleton":"xaFiq/"}],7:[function(require,module,exports){
var React, TeamView, TeamsListView, teamsCollection;

React = require('react');

TeamsListView = require('./views/teams_list');

TeamView = require('./views/team');

teamsCollection = require('./instances/collections/teams');

module.exports = {
  "/": function() {
    return teamsCollection.fetched.then(function() {
      return {
        title: "Etusivu",
        component: TeamsListView({
          teams: teamsCollection
        })
      };
    });
  },
  "/joukkueet/:id": function(id) {
    return teamsCollection.fetched.then(function() {
      return {
        title: "Joukkueet - " + id,
        component: TeamView({
          team: teamsCollection.get(id)
        })
      };
    });
  }
};


},{"./instances/collections/teams":3,"./views/team":9,"./views/teams_list":11,"react":"xT97vT"}],8:[function(require,module,exports){
var events;

events = require('events');

module.exports = {
  navigate: function(e) {
    return events.trigger("navigate", this.url());
  }
};


},{"events":4}],9:[function(require,module,exports){
var React, Team, div;

React = require('react');

div = React.DOM.div;

Team = React.createClass({
  render: function() {
    return div({
      className: "team " + (this.props.team.get('id'))
    }, this.props.team.get('name'));
  }
});

module.exports = Team;


},{"react":"xT97vT"}],10:[function(require,module,exports){
var React, TeamItem, div, navigateMixin;

React = require('react');

navigateMixin = require('./mixins/navigate');

div = React.DOM.div;

TeamItem = React.createClass({
  mixins: [navigateMixin],
  url: function() {
    return "/joukkueet/" + (this.props.team.get('id'));
  },
  render: function() {
    return div({
      className: "team " + (this.props.team.get('id')),
      onClick: this.navigate
    }, this.props.team.get('name'));
  }
});

module.exports = TeamItem;


},{"./mixins/navigate":8,"react":"xT97vT"}],11:[function(require,module,exports){
var React, TeamItem, TeamsList, div;

React = require('react');

TeamItem = require('./team_item');

div = React.DOM.div;

TeamsList = React.createClass({
  render: function() {
    return div({
      className: "teams_view"
    }, this.props.teams.map(function(team) {
      return TeamItem({
        key: team.get('id'),
        team: team
      });
    }));
  }
});

module.exports = TeamsList;


},{"./team_item":10,"react":"xT97vT"}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC9jbGllbnQuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvY29sbGVjdGlvbnMvdGVhbXMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvaW5zdGFuY2VzL2NvbGxlY3Rpb25zL3RlYW1zLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL2luc3RhbmNlcy9ldmVudHMuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvbGliL2V4b3NrZWxldG9uL2NsaWVudF9hamF4LmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL21vZGVscy90ZWFtLmNvZmZlZSIsIi9Vc2Vycy9ob3BwdWxhL3JlcG9zL2xpaWdhX2Zyb250ZW5kL3JvdXRlcy5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy9taXhpbnMvbmF2aWdhdGUuY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbS5jb2ZmZWUiLCIvVXNlcnMvaG9wcHVsYS9yZXBvcy9saWlnYV9mcm9udGVuZC92aWV3cy90ZWFtX2l0ZW0uY29mZmVlIiwiL1VzZXJzL2hvcHB1bGEvcmVwb3MvbGlpZ2FfZnJvbnRlbmQvdmlld3MvdGVhbXNfbGlzdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsaUVBQUE7O0FBQUEsQ0FBQSxFQUFRLEVBQVIsRUFBUTs7QUFDUixDQURBLEVBQ1MsR0FBVCxDQUFTLENBQUE7O0FBQ1QsQ0FGQSxFQUVXLElBQUEsQ0FBWCxFQUFXOztBQUVYLENBSkEsRUFJVyxJQUFBLENBQVgsS0FBVzs7QUFDWCxDQUxBLEVBS2dC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dWlyZSAnZXZlbnRzJ1xuZGlyZWN0b3IgPSByZXF1aXJlICdkaXJlY3RvcidcblxuQmFja2JvbmUgPSByZXF1aXJlICdleG9za2VsZXRvbidcbkJhY2tib25lLmFqYXggPSByZXF1aXJlICcuL2xpYi9leG9za2VsZXRvbi9jbGllbnRfYWpheCdcblxuIyBzaGFyZWQgcm91dGVzIGJldHdlZW4gY2xpZW50ICYgc2VydmVyLCBiYXNpY2FsbHkgYWxsIHB1YmxpY1xuIyBHRVQgcm91dGVzIHRoYXQgc2hvdWxkIGdldCBpbmRleGVkIGJ5IHNlYXJjaCBlbmdpbmVzXG5zaGFyZWRSb3V0ZXMgPSByZXF1aXJlICcuL3JvdXRlcydcblxuYXBwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ2FwcCdcblxucmVuZGVyID0gKG9wdGlvbnM9e30pIC0+XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIilbMF0uaW5uZXJIVE1MID0gb3B0aW9ucy50aXRsZVxuICBSZWFjdC5yZW5kZXJDb21wb25lbnQob3B0aW9ucy5jb21wb25lbnQsIGFwcENvbnRhaW5lcilcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgLT5cbiAgUmVhY3QuaW5pdGlhbGl6ZVRvdWNoRXZlbnRzKHRydWUpXG5cbiAgcm91dGVyID0gZGlyZWN0b3IuUm91dGVyKCkuY29uZmlndXJlKGh0bWw1aGlzdG9yeTogdHJ1ZSlcblxuICBmb3Igcm91dGUsIGFjdGlvbiBvZiBzaGFyZWRSb3V0ZXNcbiAgICAoKHJvdXRlLCBhY3Rpb24pIC0+XG4gICAgICByb3V0ZXIub24gcm91dGUsIC0+XG4gICAgICAgIGFjdGlvbi5hcHBseShALCBhcmd1bWVudHMpLnRoZW4gKG9wdGlvbnMpIC0+XG4gICAgICAgICAgcmVuZGVyKG9wdGlvbnMpXG4gICAgKShyb3V0ZSwgYWN0aW9uKVxuXG4gIHJvdXRlci5pbml0KClcblxuICBldmVudHMub24gXCJuYXZpZ2F0ZVwiLCAodXJsKSAtPlxuICAgIHJvdXRlci5zZXRSb3V0ZSB1cmxcbiIsIkJhY2tib25lID0gcmVxdWlyZSAnZXhvc2tlbGV0b24nXG5UZWFtTW9kZWwgPSByZXF1aXJlICcuLi9tb2RlbHMvdGVhbSdcblxuVGVhbXNDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmRcbiAgdXJsOiBcImh0dHA6Ly8xOTIuMTY4LjExLjY6NDAwMC9qc29uL3RlYW1zLmpzb25cIlxuICBtb2RlbDogVGVhbU1vZGVsXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbXNDb2xsZWN0aW9uIiwiVGVhbXNDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi4vLi4vY29sbGVjdGlvbnMvdGVhbXMnXG5cbnRlYW1zQ29sbGVjdGlvbiA9IG5ldyBUZWFtc0NvbGxlY3Rpb24oW10pXG50ZWFtc0NvbGxlY3Rpb24uZmV0Y2hlZCA9IHRlYW1zQ29sbGVjdGlvbi5mZXRjaCgpXG5cbm1vZHVsZS5leHBvcnRzID0gdGVhbXNDb2xsZWN0aW9uIiwiQmFja2JvbmUgPSByZXF1aXJlICdleG9za2VsZXRvbidcbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuZXh0ZW5kIEJhY2tib25lLkV2ZW50cyIsIlEgPSByZXF1aXJlICdxJ1xucmVxdWVzdCA9IHJlcXVpcmUgJ2Jyb3dzZXItcmVxdWVzdCdcblxubW9kdWxlLmV4cG9ydHMgPSAob3B0aW9ucykgLT5cbiAgZGVmZXJyZWQgPSBRLmRlZmVyKClcblxuICBvcHRzID1cbiAgICB1cmw6IG9wdGlvbnMudXJsXG4gICAgbWV0aG9kOiBvcHRpb25zLnR5cGUgfHwgXCJHRVRcIlxuICAgIGpzb246IG9wdGlvbnMuZGF0YVR5cGUgaXMgXCJqc29uXCJcblxuICBvcHRzLmJvZHkgaWYgb3B0aW9ucy5kYXRhXG5cbiAgcmVxdWVzdCBvcHRzLCAoZXJyLCByZXNwLCBib2R5KSAtPlxuICAgIGlmIGVyclxuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycilcbiAgICAgIG9wdGlvbnMuZXJyb3IoZXJyKSBpZiBvcHRpb25zLmVycm9yXG4gICAgZWxzZVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShib2R5KVxuICAgICAgb3B0aW9ucy5zdWNjZXNzKGJvZHkpIGlmIG9wdGlvbnMuc3VjY2Vzc1xuXG4gIGRlZmVycmVkLnByb21pc2UiLCJCYWNrYm9uZSA9IHJlcXVpcmUgJ2V4b3NrZWxldG9uJ1xuVGVhbU1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kIHt9XG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1Nb2RlbCIsIlJlYWN0ID0gcmVxdWlyZSAncmVhY3QnXG5UZWFtc0xpc3RWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy90ZWFtc19saXN0J1xuVGVhbVZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3RlYW0nXG50ZWFtc0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL2luc3RhbmNlcy9jb2xsZWN0aW9ucy90ZWFtcydcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIFwiL1wiOiAtPlxuICAgIHRlYW1zQ29sbGVjdGlvbi5mZXRjaGVkLnRoZW4gLT5cbiAgICAgIHRpdGxlOiBcIkV0dXNpdnVcIlxuICAgICAgY29tcG9uZW50OiBUZWFtc0xpc3RWaWV3KHRlYW1zOiB0ZWFtc0NvbGxlY3Rpb24pXG5cbiAgXCIvam91a2t1ZWV0LzppZFwiOiAoaWQpIC0+XG4gICAgdGVhbXNDb2xsZWN0aW9uLmZldGNoZWQudGhlbiAtPlxuICAgICAgdGl0bGU6IFwiSm91a2t1ZWV0IC0gI3tpZH1cIlxuICAgICAgY29tcG9uZW50OiBUZWFtVmlldyh0ZWFtOiB0ZWFtc0NvbGxlY3Rpb24uZ2V0KGlkKSkiLCJldmVudHMgPSByZXF1aXJlICdldmVudHMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgbmF2aWdhdGU6IChlKSAtPlxuICAgIGV2ZW50cy50cmlnZ2VyIFwibmF2aWdhdGVcIiwgQHVybCgpIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdCdcbntkaXZ9ID0gUmVhY3QuRE9NXG5cblRlYW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBkaXZcbiAgICAgIGNsYXNzTmFtZTogXCJ0ZWFtICN7QHByb3BzLnRlYW0uZ2V0KCdpZCcpfVwiXG4gICAgLCBAcHJvcHMudGVhbS5nZXQoJ25hbWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW0iLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0J1xubmF2aWdhdGVNaXhpbiA9IHJlcXVpcmUgJy4vbWl4aW5zL25hdmlnYXRlJ1xue2Rpdn0gPSBSZWFjdC5ET01cblxuVGVhbUl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBtaXhpbnM6IFtuYXZpZ2F0ZU1peGluXVxuXG4gIHVybDogLT5cbiAgICBcIi9qb3Vra3VlZXQvI3tAcHJvcHMudGVhbS5nZXQoJ2lkJyl9XCJcblxuICByZW5kZXI6IC0+XG4gICAgZGl2XG4gICAgICBjbGFzc05hbWU6IFwidGVhbSAje0Bwcm9wcy50ZWFtLmdldCgnaWQnKX1cIlxuICAgICAgb25DbGljazogQG5hdmlnYXRlXG4gICAgLCBAcHJvcHMudGVhbS5nZXQoJ25hbWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlYW1JdGVtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdCdcblRlYW1JdGVtID0gcmVxdWlyZSAnLi90ZWFtX2l0ZW0nXG57ZGl2fSA9IFJlYWN0LkRPTVxuXG5UZWFtc0xpc3QgPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gIHJlbmRlcjogLT5cbiAgICBkaXYgY2xhc3NOYW1lOiBcInRlYW1zX3ZpZXdcIixcbiAgICAgIEBwcm9wcy50ZWFtcy5tYXAgKHRlYW0pIC0+XG4gICAgICAgIFRlYW1JdGVtKGtleTogdGVhbS5nZXQoJ2lkJyksIHRlYW06IHRlYW0pXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbXNMaXN0Il19
;