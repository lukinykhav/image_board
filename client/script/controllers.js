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
    ['$scope', '$location', 'AuthService', '$customHttp',
        function ($scope, $location, AuthService, $customHttp) {

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

            $scope.loadAvatar = function () {
                console.log(123);
                var fd = new FormData();
                for (var key in $scope.customer) {
                    fd.append(key, $scope.customer[key]);
                }
                AuthService.loadAvatar(fd);
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

angular.module('myApp').controller('boardController',
    ['$scope', '$location', 'BoardService', '$mdDialog', 'dataHolder', '$http',
        function ($scope, $location, BoardService, $mdDialog, dataHolder, $http) {

            $scope.board_name = $location.path().split('/')[2];
            dataHolder.updateValue($scope.board_name);
            // $scope.value = '';

            $http.get('/get_post/:' + $scope.board_name)
                .success(function (data) {
                    $scope.posts = data;

                });

            $scope.showAdd = function () {
                $mdDialog.show({
                    controller: 'postController',
                    templateUrl: 'partials/add_post.html'
                });
            }
        }
    ]
);

angular.module('myApp').controller('postController',
    ['$scope', '$location', '$mdDialog', '$http', 'dataHolder', '$customHttp',
        function ($scope, $location, $mdDialog, $http, dataHolder, $customHttp) {

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.uploadFile = function () {
                var fd = new FormData();
                $scope.customer.board_name = dataHolder.getValue();
                for (var key in $scope.customer) {
                    fd.append(key, $scope.customer[key]);
                }
                $customHttp.addToken();
                $http.post('/add_post', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
            }

        }
    ])
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);