angular.module('myApp').controller('addPostController',
    ['$scope', '$location', '$http', 'dataHolder', '$customHttp',
        function ($scope, $location, $http, dataHolder, $customHttp) {
            var defaultForm = {
                caption: "",
                file: "",
                board_id: "",
                post_id: ""
            };

            $scope.uploadFile = function (post_id, posts) {
                $scope.error = false;
                var fd = new FormData();
                $scope.customer.board_id = dataHolder.getValue();
                $scope.customer.post_id = post_id;
                for (var key in $scope.customer) {
                    fd.append(key, $scope.customer[key]);
                }
                $customHttp.addToken();
                $http.post('/add_post', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(post) {
                        if(post.errorMessage) {
                            $scope.error = true;
                            $scope.errorMessage = "Not valid caption field";
                        }
                        else {
                            if(post.data.post_id === null) {
                                posts.push(post.data);
                            }
                            else {
                                post.data['class'] = 'comment';
                                posts.push(post.data);
                            }
                            $scope.addPostForm =! $scope.addPostForm;
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