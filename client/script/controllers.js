angular.module('myApp').controller('loginController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.login = function () {

                // initial values
                $scope.error = false;

                // call login from service
                AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                    // handle success
                    .then(function (token) {
                        localStorage.setItem('token', token);
                        $location.path('/profile');
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                    });
                $scope.loginForm = {};
            };

            $scope.showRegister = function () {
                $location.path('/register');
            }

        }]);

angular.module('myApp').controller('logoutController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            $scope.logout = function () {

                // call logout from service
                AuthService.logout()
                    .then(function () {
                        localStorage.removeItem('token');
                        $location.path('/login');
                    });

            };

        }
    ]
);

angular.module('myApp').controller('profileController',
    ['$scope', '$location', 'AuthService', 'FileUploader',
        function ($scope, $location, AuthService, FileUploader) {

            $scope.showForm = function () {
                $scope.formProfile = !$scope.formProfile;
                $scope.editProfile();
            };

            $scope.profile = function () {
                AuthService.profile()
                    .then(function (data) {
                        $scope.name = data.name;
                        $scope.email = data.email;
                        $scope.image = data.image;
                        $scope.description = data.description;
                    })
            };

            $scope.editProfile = function () {
                AuthService.editProfile($scope.name, $scope.email, $scope.description)
                    .then(function (data) {
                        console.log(data);
                    })
            };

            $scope.uploader = new FileUploader({
                url: '/load_avatar',
                autoUpload: true
            });
        }
    ]
);

angular.module('myApp').controller('registerController',
    ['$scope', '$location', 'AuthService', '$state',
        function ($scope, $location, AuthService) {

            $scope.register = function () {

                // initial values
                $scope.error = false;

                // call register from service
                AuthService.register($scope.registerForm.username, $scope.registerForm.email, $scope.registerForm.password)
                    // handle success
                    .then(function () {
                        $location.path('/login');
                    })
                    // handle error
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "This name of user exists!";
                    });
                $scope.registerForm = {};
            };
        }
    ]
);

angular.module('myApp').controller('boardsController',
    ['$scope', '$location', 'BoardService',
        function ($scope, $location, BoardService) {

            $scope.showAddBoardForm = function () {
                $scope.addBoardForm = !$scope.addBoardForm;
                $scope.listBoard();
            };

            $scope.listBoard = function () {
                BoardService.listBoard()
                    .then(function (data) {
                        $scope.boards = data;
                    })
            };

            $scope.addBoard = function () {
                BoardService.addBoard($scope.name, $scope.description)
                    .then(function (data) {
                    })
                    .catch(function () {
                       $scope.errorMessage = "Error";
                    });
            };

            $scope.showAll = function () {
                BoardService.allBoard()
                    .then(function (data) {
                        $scope.boards = data;
                    })
            }
        }
    ]
);

angular.module('myApp').controller('boardController',
    [
        '$scope', '$location', 'BoardService', '$mdDialog',
        'dataHolder', '$http', 'filter','PostService',
        function (
            $scope, $location, BoardService, $mdDialog,
            dataHolder, $http, filter, PostService
        ) {
            var filtred = [];
            var id = $location.path().split('/')[2];
            var token = localStorage.getItem('token');
            
            BoardService.getBoard(id)
                .then(function(data) {
                    filtred = filter.filterPosts(data.posts);
                    $scope.board_name = data.board.name;
                    $scope.posts = filtred.posts;
                    $scope.comments = filtred.comments;
                    dataHolder.updateValue(data.board._id);
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
            }
        }
    ]
);

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

            $scope.showAdd = function (post_id) {
                $mdDialog.show({
                    controller: 'addPostController',
                    templateUrl: 'partials/add_post.html',
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

angular.module('myApp').controller('addPostController',
    ['$scope', '$location', '$http', 'dataHolder', '$customHttp', 'usSpinnerService',
        function ($scope, $location, $http, dataHolder, $customHttp, usSpinnerService) {
            var defaultForm = {
                caption: "",
                fiel: "",
                board_id: "",
                post_id: ""
            };

            $scope.startSpin = function(){
                usSpinnerService.spin('spinner');
                setTimeout(function(){
                    if(document.getElementById('file_input_file').value) {
                        usSpinnerService.stop('spinner');
                    }
                }, 3000);
            };

            $scope.uploadFile = function (post_id, posts) {
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
                        if(post.data.post_id === null) {
                            posts.push(post.data);
                        }
                        else {
                            post.data['class'] = 'comment';
                            posts.push(post.data);
                        }
                        $scope.add_post.$setPristine();
                        $scope.add_post.$setUntouched();
                        $scope.customer = angular.copy(defaultForm);
                    });
            }

        }
    ]
);

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
    }]);

angular.module('myApp').controller('editPostController',
    ['$scope', '$http', 'locals', '$mdDialog', 'PostService', function ($scope, $http, locals, $mdDialog, PostService) {

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.uploadFile = function () {
            var fd = new FormData();
            for (var key in $scope.customer) {
                fd.append(key, $scope.customer[key]);
            }

            PostService.editPost(locals.post_id, fd)
                .then(function(data) {
                    $scope.posts = PostService.changePost(locals.posts, data);
                })
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Permission denied!";
                })
        }

    }]);

angular.module('myApp').controller('likeController',
    ['$scope', '$http', 'PostService', function ($scope, $http, PostService) {
        $scope.like = function (post_id) {
            PostService.liking(post_id, 1)
                .then(function(data) {
                    $scope.posts = PostService.changePost($scope.posts, data);
                })
        };

        $scope.dislike = function (post_id) {
            PostService.liking(post_id, 0)
                .then(function(data) {
                    $scope.posts = PostService.changePost($scope.posts, data);
                })
        };

        $scope.Math = Math;
    }]);
