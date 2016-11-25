angular.module('myApp').controller('mainController',
    ['$scope', '$rootScope',
        function ($scope, $rootScope) {
            $scope.user_list = false;
            if (localStorage.getItem('role') === 'admin') {
                $scope.user_list = true;
            }

        }
    ]
);