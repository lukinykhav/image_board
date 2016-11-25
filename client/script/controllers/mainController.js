angular.module('myApp').controller('mainController',
    ['$scope', '$rootScope',
        function ($scope, $rootScope) {
            $scope.user_list = false;
            if($rootScope.userRole === 'admin') {
                $scope.user_list = true;
            }

        }
    ]
);