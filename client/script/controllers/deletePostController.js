angular.module('myApp').controller('deletePostController',
    ['$scope', '$http', function ($scope, $http) {
        $scope.deletePost = function (id) {
            $http.get('/delete_post/:' + id)
                .success(function (data) {
                    for (var i = 0; i < $scope.posts.length; i++) {
                        if ($scope.posts[i]['_id'] === id) {
                            $scope.posts.splice(i, 1);
                        }
                    }
                })
                .error(function (err) {
                    console.log(err);
                })
        };
    }]
);