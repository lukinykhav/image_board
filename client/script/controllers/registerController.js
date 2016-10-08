angular.module('myApp').controller('registerController',
    ['$scope', '$location', 'AuthService', '$state',
        function ($scope, $location, AuthService) {

            $scope.register = function () {

                $scope.error = false;

                AuthService.register($scope.registerForm.username, $scope.registerForm.email, $scope.registerForm.password)
                    .then(function () {
                        AuthService.login($scope.registerForm.username, $scope.registerForm.password)
                            .then(function () {
                                $location.path('/profile');
                            });
                    })
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "This name of user exists!";
                    });
            };
        }
    ]
);