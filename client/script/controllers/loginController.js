angular.module('myApp').controller('loginController',
    ['$scope', 'AuthService', '$state',
        function ($scope, AuthService, $state) {

            if (localStorage.getItem('username') && localStorage.getItem('password')) {
                $scope.username = localStorage.getItem('username');
                $scope.password = localStorage.getItem('password');
            }

            $scope.login = function () {

                $scope.error = false;

                AuthService.login($scope.username, $scope.password)
                    .then(function () {
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
                $location.path('/register');
            }

        }]);
