var myApp = angular.module('myApp',
    [
        'ngMaterial', 'ngMessages', 'ui.router', 'vcRecaptcha',
        'angularFileUpload', 'angularUtils.directives.dirPagination',
        'angularSpinner', 'ngCookies', 'ngStorage'
    ]);

myApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('anon', {
            abstract: true,
            templateUrl: 'partials/auth.html'
        })
        .state('anon.login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'loginController',
            data: {
                'noLogin': true
            }
        })
        .state('anon.register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'registerController',
            data: {
                'noLogin': true
            }
        });


    $stateProvider
        .state('user', {
            abstract: true,
            templateUrl: 'partials/main.html'
        })
        .state('user.profile', {
            url: '/user_profile',
            templateUrl: 'partials/profile.html',
            controller: 'profileController'
        })
        .state('user.logout', {
            url: '/logout',
            controller: 'logoutController'
        })
        .state('user.boards', {
           url: '/boards',
           templateUrl: 'partials/boards.html',
           controller: 'boardsController'
        })
        .state('user.board', {
           url: '/board/:id',
           templateUrl: 'partials/board.html',
           controller: 'boardController'
        })
        .state('user.post', {
           url: '/post/:id',
           templateUrl: 'partials/post.html',
           controller: 'postController'
        })
        .state('404', {
           url: '/404',
           templateUrl: 'partials/404.html'
        });

    //$urlRouterProvider.when('/', '/profile');
    //$urlRouterProvider.otherwise('/404');
    $locationProvider.html5Mode(true).hashPrefix('!');

}]);

myApp.run(function ($rootScope, $state, AuthService, $location, $stateParams) {

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {

             AuthService.getUserStatus()
                 .then(function (data) {
                      if (data) {
                          $state.go(toState.name, toParams);
                      }
                      else {
                          if (toState.url === '/register') {
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













