angular.module('myApp').controller('deletePostController',
    ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.deletePost = function (id) {
            $http.get('/delete_post/:' + id)
                .success(function (data) {
                    if (data.post.post_id == 'null') {
                        $state.go('user.board', {id: data.post.board_id})
                    }
                    for (var i = 0; i < $scope.posts.length; i++) {
                        var child_id = [];
                        function findChildren (id) {
                            for (var i = 0; i < $scope.posts.length; i++) {
                                if ($scope.posts[i]._id === id) {
                                    if($scope.posts[i]['children'] !== null) {
                                        var arr = $scope.posts[i]['children'].split(',');
                                        for (var j = 0; j < arr.length; j++) {
                                            child_id.push(arr[j]);
                                            findChildren(arr[j]);
                                        }
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            }
                        }
                        if (data.hasOwnProperty('parent') && $scope.posts[i]['_id'] === data.parent._id) {
                            $scope.posts[i]['children'] = data.parent.children;
                        }
                        if ($scope.posts[i]['_id'] === id) {
                            findChildren(id);
                            $scope.posts.splice(i, 1);
                            var i = 0;
                            while(i < $scope.posts.length) {
                                if (child_id.indexOf($scope.posts[i]['_id']) > -1) {
                                    $scope.posts.splice(i, 1);
                                    continue;
                                }
                                i++;
                            }
                        }
                    }
                })
                .error(function (err) {
                    console.log(err);
                })
        };
    }]
);