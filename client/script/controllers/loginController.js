angular.module('myApp').controller('loginController',
    ['$scope', 'AuthService', '$state', '$rootScope',
        function ($scope, AuthService, $state, $rootScope) {

            if (localStorage.getItem('username') && localStorage.getItem('password')) {
                $scope.username = localStorage.getItem('username');
                $scope.password = localStorage.getItem('password');
            }

            $scope.login = function () {

                $scope.error = false;

                AuthService.login($scope.username, $scope.password)
                    .then(function (data) {
                        $rootScope.userRole = data.role;
                        if ($scope.remember) {
                            localStorage.setItem('username', $scope.username);
                            localStorage.setItem('password', $scope.password);
                        }
                        else {
                            localStorage.clear();
                        }
                        $state.go('user.profile',{},{reload:true});
                    })
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                    });
            };

            $scope.showRegister = function () {
                $state.go('anon.register');
            }

        }]);
