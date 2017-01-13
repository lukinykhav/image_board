angular.module('myApp').controller('deletePostController',
    ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.deletePost = function (id) {
            $http.get('/delete_post/:' + id)
                .success(function (data) {
                    if (data.post.post_id == 'null') {
                        $state.go('user.board', {id: data.post.board_id})
                    }
                    for (var i = 0; i < $scope.posts.length; i++) {
                        if (data.hasOwnProperty('parent') && $scope.posts[i]['_id'] === data.parent._id) {
                            $scope.posts[i]['children'] = data.parent.children;
                        }
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