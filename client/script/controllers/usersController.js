angular.module('myApp').controller('usersController',
    ['$scope', '$http',
        function ($scope, $http) {

            $http.get('/users')
                // handle success
                .success(function (data) {
                    $scope.people = data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].role === 'admin') {
                            $scope.people[i].admin = true;
                        }
                        else {
                            $scope.people[i].admin = false;
                        }
                    }
                })
                // handle error
                .error(function (data) {
                    console.log(data);
                });
            
            $scope.assignRole = function (username) {
                $http.post('/assign_role', {username: username})
                    .success(function (data) {
                        for (var i = 0; i < $scope.people.length; i++) {
                            if(data._id === $scope.people._id) {
                                $scope.people[i].admin = !person.admin;
                            }
                        }
                    })
            };

        }
    ]
);
