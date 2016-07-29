var myApp = angular.module('myApp',
    [
        'ngMaterial', 'ngMessages', 'ui.router', 'vcRecaptcha',
        'angularFileUpload', 'angularUtils.directives.dirPagination',
        'angularSpinner', 'ngCookies'
    ]);

myApp.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
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
            templateUrl: 'partials/main.html'
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
        });

    $urlRouterProvider.when('/', '/login');
    // $urlRouterProvider.otherwise('/profile');
    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.path();

        console.log(path);
    });

    // $urlRouterProvider.rule ($injector, $location) ->
    // path = $location.path()
    // pathChanged = no
    // if matcher.test(path)
    //     path = path.substr(0, path.length - 5)
    // pathChanged = yes
    // unless path[path.length-1] is '/'
    // path = path + '/'
    // pathChanged = yes
    // return path if pathChanged

}]);

myApp.run(function ($rootScope, $state, AuthService) {

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            AuthService.getUserStatus()
                .then(function (data) {
                    if (data) {
                        $state.go(toState.name);
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













