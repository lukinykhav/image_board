angular.module('myApp').controller('addPostController',
    ['$scope', '$location', '$http', 'dataHolder', '$customHttp', '$rootScope',
        function ($scope, $location, $http, dataHolder, $customHttp, $rootScope) {
            var defaultForm = {
                caption: "",
                file: "",
                board_id: "",
                post_id: ""
            };

            $scope.uploadFile = function (post_id, posts, comment) {
                $scope.error = false;
                var fd = new FormData();
                $scope.customer.board_id = dataHolder.getValue();
                $scope.customer.post_id = post_id;
                $scope.customer.comment = comment;
                for (var key in $scope.customer) {
                    fd.append(key, $scope.customer[key]);
                }
                $customHttp.addToken();
                $http.post('/add_post', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(post) {
                        var index;
                        if(post.errorMessage) {
                            $scope.error = true;
                            $scope.errorMessage = "Not valid caption field";
                        }
                        else {
                            if (post.data.post_id === null) {
                                posts.push(post.data);
                            }
                            else {
                                post.data['class'] = 'comment';
                                for (var i = 0; i < posts.length; i++) {
                                    if (posts[i]._id === post.data.post_id) {
                                        index = i;
                                    }
                                }
                                posts.splice(index+1, 0, post.data);
                                // posts.push(post.data);
                            }
                            $rootScope.addPostForm =! $rootScope.addPostForm;
                            $scope.add_post.$setPristine();
                            $scope.add_post.$setUntouched();
                            $scope.add_post.$invalid = true;
                            $scope.customer = angular.copy(defaultForm);
                        }
                    })
            };
        }
    ]
);