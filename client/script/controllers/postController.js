angular.module('myApp').controller('postController',
    ['$scope', '$location', 'PostService', '$mdDialog', '$http', 'filter', '$rootScope', '$document',
        function ($scope, $location, PostService, $mdDialog, $http, filter, $rootScope, $document) {
            var id = $location.path().split('/')[2];
            var filtred = [];
            var arr_id = [];
            var token = localStorage.getItem('token');
            $rootScope.arr_display = [];

            PostService.getPost(id)
                .then(function (data) {
                    filtred = filter.filterPosts(data);
                    $scope.posts = filtred.posts;
                    // if(filtred.comments.length > 0) {
                    //     $scope.comments = true;
                    // }
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

            $scope.addComment = function (id, posts) {
                $rootScope.addPostForm = !$rootScope.addPostForm;
                $scope.id = id;
                $scope.arr_posts = posts;

            };

            $scope.getComments = function (post_id) {
                if($rootScope.arr_display.indexOf(post_id) === -1) {
                    PostService.getComments(post_id)
                        .then(function (data) {
                            var index, arr_posts_id = [];

                            for (var j = 0; j < $scope.posts.length; j++) {
                                arr_posts_id.push($scope.posts[j]['_id']);
                                if(post_id === $scope.posts[j]['_id']) {
                                    index = j;
                                }
                            }

                            for (var i = 0; i < data.length; i++) {
                                if(arr_posts_id.indexOf(data[i]._id) === -1) {
                                    data[i]['class'] = 'comment';
                                    $scope.posts.splice(index+1, 0, data[i]);
                                    $scope.displayComments = true;
                                }
                            }
                        });
                    $rootScope.arr_display.push(post_id);
                }
                else {
                    $rootScope.arr_display.splice($rootScope.arr_display.indexOf(post_id), 1);
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
                    findChildren(post_id);
                    var i = 0;
                    while(i < $scope.posts.length) {
                        if (child_id.indexOf($scope.posts[i]['_id']) > -1) {
                            $rootScope.arr_display.splice($rootScope.arr_display.indexOf($scope.posts[i]['_id']), 1);
                            $scope.posts.splice(i, 1);
                            continue;
                        }
                        i++;
                    }
                }
                //var child_id = [];
                //function findChildren (id) {
                //    for (var i = 0; i < $scope.posts.length; i++) {
                //        if ($scope.posts[i]._id === id) {
                //            if($scope.posts[i]['children'] !== null) {
                //                var arr = $scope.posts[i]['children'].split(',');
                //                console.log(arr);
                //                for (var j = 0; j < arr.length; j++) {
                //                    child_id.push(arr[j]);
                //                    findChildren(arr[j]);
                //                    //    //if ($scope.posts[i]._id === arr[j]) {
                //                    //    //    console.log($scope.posts[i]);
                //                    //    //}
                //                }
                //            }
                //            else {
                //                return true;
                //            }
                //        }
                //        else {
                //            PostService.getComments(post_id)
                //                .then(function (data) {
                //                    var index, arr_posts_id = [];
                //
                //                    for (var j = 0; j < $scope.posts.length; j++) {
                //                        arr_posts_id.push($scope.posts[j]['_id']);
                //                        if(post_id === $scope.posts[j]['_id']) {
                //                            index = j;
                //                        }
                //                    }
                //
                //                    for (var i = 0; i < data.length; i++) {
                //                        if(arr_posts_id.indexOf(data[i]._id) === -1) {
                //                            data[i]['class'] = 'comment';
                //                            $scope.posts.splice(index+1, 0, data[i]);
                //                            $scope.displayComments = true;
                //                        }
                //                        //else {
                //                        //    $scope.posts.splice(index+1, 1);
                //                        //    $scope.displayComments = false;
                //                        //}
                //                    }
                //                });
                //        }
                //    }
                //}
                //findChildren(post_id);
                //for (var i = 0; i < $scope.posts.length; i++) {
                //    console.log(child_id.indexOf($scope.posts[i]['_id']));
                //    if (child_id.indexOf($scope.posts[i]['_id'] > -1)) {
                //        $scope.posts.splice(i, 1)
                //    }
                //}
                //findChildren('5879fbec906d609e11a45daa');
                //console.log(child_id);

                //for (var i = 0; i < $scope.posts.length; i++) {
                //    if (child_id.indexOf($scope.posts[i]['_id'] !== -1)) {
                //        console.log($scope.posts[i]);
                //    }
                //    //if ($scope.posts[i]._id === post_id && $scope.posts[i]['children'] !== null) {
                //    //    var arr = $scope.posts[i]['children'].split(',');
                //    //    console.log(arr);
                //    //    for (var j = 0; j < arr.length; j++) {
                //    //        console.log(arr[j]);
                //    //    }
                //    //}
                //}


                //if ($rootScope.arr_display.indexOf(post_id) === -1) {
                //    $rootScope.arr_display.push(post_id);
                //}
                //else {
                //    $rootScope.arr_display.splice($rootScope.arr_display.indexOf(post_id), 1);
                //}

                //PostService.getComments(post_id)
                //    .then(function (data) {
                //        var index, arr_posts_id = [];
                //
                //        for (var j = 0; j < $scope.posts.length; j++) {
                //            arr_posts_id.push($scope.posts[j]['_id']);
                //            if(post_id === $scope.posts[j]['_id']) {
                //                index = j;
                //            }
                //        }
                //
                //        for (var i = 0; i < data.length; i++) {
                //            if(arr_posts_id.indexOf(data[i]._id) === -1) {
                //                data[i]['class'] = 'comment';
                //                $scope.posts.splice(index+1, 0, data[i]);
                //                $scope.displayComments = true;
                //            }
                //            else {
                //                $scope.posts.splice(index+1, 1);
                //                $scope.displayComments = false;
                //            }
                //        }
                //    });
            };
        }
    ]
);