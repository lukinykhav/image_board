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
    ['$scope', '$location', 'BoardService', '$mdDialog', 'dataHolder', '$http', 'filter',
        function ($scope, $location, BoardService, $mdDialog, dataHolder, $http, filter) {
            var filtred = [];
            var id = $location.path().split('/')[2];
            
            $http.get('/get_board/:' + id)
                .success(function (data) {
                    filtred = filter.filterPosts(data.posts);
                    $scope.board_name = data.board.name;
                    $scope.posts = filtred.posts;
                    $scope.comments = filtred.comments;
                    dataHolder.updateValue(data.board._id);

                })
                .error(function (data) {
                   console.log(data);
                });

            $scope.showAdd = function (post_id) {
                $mdDialog.show({
                    controller: 'addPostController',
                    templateUrl: 'partials/add_post.html',
                    locals: {post_id: post_id}
                });
            };

            $scope.editPost = function (post_id) {
                $mdDialog.show({
                    controller: 'editPostController',
                    templateUrl: 'partials/add_post.html',
                    locals: {post_id: post_id}
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

            PostService.getPost(id)
                .then(function (data) {
                    filtred = filter.filterPosts(data);
                    $scope.comments = filtred.comments;
                    $scope.posts = filtred.posts;
                });

            $scope.editPost = function (post_id) {
                $mdDialog.show({
                    controller: 'editPostController',
                    templateUrl: 'partials/add_post.html',
                    locals: {post_id: post_id}
                });
            };

            $scope.showAdd = function (post_id) {
                $mdDialog.show({
                    controller: 'addPostController',
                    templateUrl: 'partials/add_post.html',
                    locals: {post_id: post_id}
                });
            };
        }
    ]
);


angular.module('myApp').controller('commentController',
    ['$scope', '$location', 'PostService', 'filter',
        function ($scope, $location, PostService, filter) {
            $scope.getComments = function (post_id) {
                PostService.getPost(post_id)
                    .then(function (data) {
                        filtred = filter.filterPosts(data);
                        for(var i = 0; i < filtred.comments.length; i++) {
                            if(filtred.comments[i]['_id'] === post_id) {
                                filtred.comments.splice(i, 1);
                            }
                        }
                        $scope.c_comments = filtred.comments;
                    });
            };        
        }
    ]
);

angular.module('myApp').controller('addPostController',
    ['$scope', '$location', '$mdDialog', '$http', 'dataHolder', '$customHttp', 'post_id',
        function ($scope, $location, $mdDialog, $http, dataHolder, $customHttp, post_id) {

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            
            $scope.uploadFile = function () {
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
            }

        }
    ]
);

angular.module('myApp').controller('deletePostController',
    ['$scope', '$http', function ($scope, $http) {
        $scope.deletePost = function (id) {
            $http.get('/delete_post/:' + id)
                .success(function (data) {
                    console.log(data);
                })
                .error(function (err) {
                    console.log(err);
                })
        };
    }]);

angular.module('myApp').controller('editPostController',
    ['$scope', '$http', 'post_id', '$mdDialog', function ($scope, $http, post_id, $mdDialog) {

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.uploadFile = function () {
            var fd = new FormData();
            for (var key in $scope.customer) {
                fd.append(key, $scope.customer[key]);
            }
            // $customHttp.addToken();
            $http.post('/edit_post/:' + post_id, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
        }

    }]);

angular.module('myApp').controller('likeController',
    ['$scope', '$http', 'PostService', function ($scope, $http, PostService) {
        $scope.like = function (post_id) {
            console.log('like');
            PostService.liking(post_id, 1)
                .then(function(data) {
                    console.log(data);
                })
        };

        $scope.dislike = function (post_id) {
            console.log('dislike');
            PostService.liking(post_id, 0)
                .then(function(data) {
                    console.log(data);
                })
        }
    }]);
