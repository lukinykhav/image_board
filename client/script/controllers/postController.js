angular.module('myApp').controller('postController',
    ['$scope', '$location', 'PostService', '$mdDialog', '$http', 'filter',
        function ($scope, $location, PostService, $mdDialog, $http, filter) {
            var id = $location.path().split('/')[2];
            var filtred = [];
            var arr_id = [];
            var token = localStorage.getItem('token');

            PostService.getPost(id)
                .then(function (data) {
                    filtred = filter.filterPosts(data);
                    $scope.posts = filtred.posts;
                    if(filtred.comments.length > 0) {
                        $scope.comments = true;
                    }
                    PostService.getUserPost(id, token)
                        .then(function (data) {
                            $scope.userRole = data[1];
                            $scope.changePost = data[0];
                        })
                });

            $scope.editPost = function (post_id) {
                $mdDialog.show({
                    controller: 'editPostController',
                    templateUrl: 'partials/edit_post.html',
                    locals: {
                        post_id: post_id,
                        posts: $scope.posts
                    }
                });
            };

            $scope.getComments = function (post_id) {
                if(arr_id.indexOf(post_id) === -1) {
                    arr_id.push(post_id);
                    PostService.getPost(post_id)
                        .then(function (data) {
                            filtred = filter.filterPosts(data);
                            for(var i = 0; i < filtred.comments.length; i++) {
                                if(filtred.comments[i]['_id'] === post_id) {
                                    filtred.comments.splice(i, 1);
                                }
                                if (filtred.comments[i]) {
                                    filtred.comments[i]['class'] = 'comment';
                                    $scope.posts.push(filtred.comments[i]);
                                }
                            }
                        });
                }
            };
        }
    ]
);