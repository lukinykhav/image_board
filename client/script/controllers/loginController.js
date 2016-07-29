angular.module('myApp').controller('loginController',
    ['$scope', '$location', 'AuthService', '$cookieStore',
        function ($scope, $location, AuthService, $cookieStore) {

            $scope.onChange = function(cbState) {
                $scope.message = cbState;
            };

            $scope.login = function () {

                // initial values
                $scope.error = false;

                // call login from service
                AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                    // handle success
                    .then(function (token) {
                        if ($scope.loginForm.remember) {
                            localStorage.setItem('token', token);
                            // $cookieStore.put('token', token);
                        }
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
