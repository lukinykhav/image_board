angular.module('myApp').controller('loginController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.login = function () {

                // initial values
                $scope.error = false;

                // call login from service
                AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                    // handle success
                    .then(function (token) {
                        localStorage.setItem('token', token);
                        $location.path('/profile');
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                    });
                $scope.loginForm = {};
            };

            $scope.showRegister = function () {
                $location.path('/register');
            }

        }]);

angular.module('myApp').controller('logoutController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.logout = function () {

                // call logout from service
                AuthService.logout()
                    .then(function () {
                        localStorage.removeItem('token');
                        $location.path('/login');
                    });

            };

        }
    ]
);

angular.module('myApp').controller('profileController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.showForm = function () {
                $scope.formProfile = !$scope.formProfile;
                $scope.editProfile();
            };

            $scope.profile = function () {
                AuthService.profile()
                    .then(function (data) {
                        $scope.name = data.name;
                        $scope.email = data.email;
                        $scope.description = data.description;
                    })
            };

            $scope.editProfile = function () {
                AuthService.editProfile($scope.name, $scope.email, $scope.description)
                    .then(function (data) {
                        console.log(data);
                    })
            };

        }
    ]
);

angular.module('myApp').controller('registerController',
    ['$scope', '$location', 'AuthService', '$state',
        function ($scope, $location, AuthService, $state) {

            $scope.register = function () {

                // initial values
                $scope.error = false;

                // call register from service
                AuthService.register($scope.registerForm.username, $scope.registerForm.email, $scope.registerForm.password)
                    // handle success
                    .then(function () {
                        $location.path('/login');
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "This name of user exists!";
                    });
                $scope.registerForm = {};
            };
        }
    ]
);

angular.module('myApp').controller('boardsController',
    ['$scope', '$location', 'BoardService',
        function ($scope, $location, BoardService) {

            $scope.showAddBoardForm = function () {
                $scope.addBoardForm = !$scope.addBoardForm;
                $scope.listBoard();
            };

            $scope.listBoard = function () {
                BoardService.listBoard()
                    .then(function (data) {
                        $scope.boards = data;
                    })
            };

            $scope.addBoard = function () {
                BoardService.addBoard($scope.name, $scope.description)
                    .then(function (data) {
                    })
                    .catch(function () {
                       $scope.errorMessage = "Error";
                    });
            };
        }
    ]
);


var myApp = angular.module('myApp', ['ngMaterial', 'ngMessages', 'ui.router', 'vcRecaptcha']);

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
        });

    $urlRouterProvider.when('/', '/login');
    // $urlRouterProvider.otherwise('/profile');
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

myApp.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {

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
}]);














angular.module('myApp').factory('AuthService',
    ['$customHttp', '$q', '$timeout', '$http',
        function ($customHttp, $q, $timeout, $http) {

            // create user variable
            var user = null;

            // return available functions for use in the controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register,
                profile: profile,
                editProfile: editProfile
            });

            function isLoggedIn() {
                console.log(user);
                if (user) {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserStatus() {
                var deferred = $q.defer();

                $http.get('/status')
                    // handle success
                    .success(function (data) {
                        if (data) {
                            user = true;
                        } else {
                            user = false;
                        }
                        deferred.resolve(user);
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                    });

                return deferred.promise;
            }

            function login(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/login',
                    {username: username, password: password})
                    // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            user = true;
                            deferred.resolve(data.token);
                        } else {
                            user = false;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/logout')
                    // handle success
                    .success(function (data) {
                        user = false;
                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function register(username, email, password) {
                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/register',
                    {username: username, email: email, password: password})
                    // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function profile() {
                var deferred = $q.defer();

                $customHttp.addToken();
                // send a get request to the server
                $http.get('/profile')
                    // handle success
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

            function editProfile(name, email, description) {
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/profile',
                    {name: name, email: email, description: description})
                    // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

        }
    ]
);

angular.module('myApp').service('$customHttp', ['$http', function ($http) {
    this.addToken = function () {
        var token = localStorage.getItem('token');
        if (token) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
        }
        else {
            $http.defaults.headers.common['Authorization'] = 'Basic ';
        }

    }
}]);


angular.module('myApp').directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    // console.info(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }

    }
}]);


angular.module('myApp').factory('BoardService',
    ['$customHttp', '$q', '$timeout', '$http',
        function ($customHttp, $q, $timeout, $http) {

            // return available functions for use in the controllers
            return ({
                listBoard: listBoard,
                addBoard: addBoard
            });

            function listBoard() {
                var deferred = $q.defer();

                $customHttp.addToken();
                // send a get request to the server
                $http.get('/list_board')
                    // handle success
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

            function addBoard(name, description) {
                var deferred = $q.defer();

                $http.post('/create_board', {name: name, description: description})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });

                return deferred.promise;
            }
        }
    ]
);