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
            controller: 'loginController'
        })
        .state('anon.register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'registerController'
        });


    $stateProvider
        .state('user', {
            abstract: true,
            templateUrl: 'partials/main.html',
            controller: 'mainController'
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
        .state('user.list', {
            url: '/users_list',
            templateUrl: 'partials/users.html',
            controller: 'usersController'
        })
        .state('404', {
           url: '/404',
           templateUrl: 'partials/404.html'
        });

    $urlRouterProvider.when('/', '/user_profile');
    $urlRouterProvider.otherwise('/404');
    $locationProvider.html5Mode(true).hashPrefix('!');

}]);

myApp.run(function ($rootScope, $state, AuthService, $location, $stateParams) {

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {

             AuthService.getUserStatus()
                 .then(function (data) {
                      if (data) {
                          if(toState.name === 'anon.register' || toState.name === 'anon.login') {
                              $state.go('user.profile');
                          }
                          else {
                              if (toState.name === 'user.list' && localStorage.getItem('role') === ('user' || 'undefined')) {
                                  $state.go('user.profile');
                              }
                              else {
                                  $state.go(toState.name, toParams);
                              }
                          }
                      }
                      else {
                          if (toState.name === 'anon.register') {
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













