var myApp = angular.module('myApp', ['ngMaterial', 'ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('anon', {
      abstract: true,
      templateUrl: 'partials/auth.html',
    })
    .state('anon.login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'loginController',
    })
    .state('anon.register', {
      url: '/register',
      templateUrl: 'partials/register.html',
      controller: 'registerController',
    })


  $stateProvider
    .state('user', {
        abstract: true,
        templateUrl: 'partials/main.html',
    })
    .state('user.profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'profileController'
    })
    .state('user.logout', {
      url: '/logout',
      controller: 'logoutController'
    })
}]);

myApp.run(function ($rootScope, $state, AuthService) {

   $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
          AuthService.getUserStatus()
            .then(function(data) {
              if(data) {
                $state.go('user.profile');
              }
              else {
                if(toState.url === '/register') {
                  $state.go('anon.register');
                }
                else {
                  $state.go('anon.login');
                } 
              }
              event.preventDefault();
            })
      }
  );
});













