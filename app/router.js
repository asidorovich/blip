var Router = window.Router;
var bows = window.bows;
var _ = window._;

var router = new Router();

router.log = bows('Router');

var configuration = {
  before: function() {
    var routeBase = router.getRoute(0);
    var isAuthenticated = router.isAuthenticated();
    var isNoAuthRoute = _.contains(router.noAuthRoutes, routeBase);

    if (!isAuthenticated && !isNoAuthRoute) {
      router.log('Not logged in, redirecting');
      router.setRoute('login');
      // Stop current routing and let new routing take over
      return false;
    }

    if (isAuthenticated && isNoAuthRoute) {
      router.log('Already logged in, redirecting');
      router.setRoute('profile');
      return false;
    }
  },

  on: function() {
    var route = router.getRoute();
    router.log('Route /' + route);
  }
};

router.configure(configuration);

router.setup = function(routes, options) {
  var self = this;
  options = options || {};

  this.isAuthenticated = options.isAuthenticated ||
                         function() { return true; };

  this.noAuthRoutes = options.noAuthRoutes || [];
  this.noAuthRoutes = this._parseNoAuthRoutes(this.noAuthRoutes);
  
  _.forEach(routes, function(handler, route) {
    self.on(route, handler);
  });

  return this;
};

router._parseNoAuthRoutes = function(routes) {
  return _.map(routes, this._getRouteFirstFragment);
};

// Return first fragment of route
// '/foo/bar' => 'foo'
router._getRouteFirstFragment = function(route) {
  var result = route.split('/');
  // Get first fragment after leading '/'
  if (result.length >= 2) {
    return result[1];
  }
  return '';
};

router.start = function() {
  this.init('/');
  this.log('Router started');
};

module.exports = router;