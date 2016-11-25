angular.module('myApp').controller('addPostController',
    ['$scope', '$location', '$http', 'dataHolder', '$customHttp', 'usSpinnerService',
        function ($scope, $location, $http, dataHolder, $customHttp, usSpinnerService) {
            var defaultForm = {
                caption: "",
                file: "",
                board_id: "",
                post_id: ""
            };

            $scope.startSpin = function() {
                usSpinnerService.spin('spinner');
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
                    })
            };
        }
    ]
);
angular.module('myApp').controller('boardController',
    [
        '$scope', '$location', 'BoardService', '$mdDialog',
        'dataHolder', '$http', 'filter','PostService', '$state',
        function (
            $scope, $location, BoardService, $mdDialog,
            dataHolder, $http, filter, PostService, $state
        ) {
            var filtred = [];
            var id = $location.path().split('/')[2];
            var token = localStorage.getItem('token');

            BoardService.getBoard(id)
                .then(function successCallback(data) {
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
                },
                function errorCallback(err) {
                    console.log(err);
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

angular.module('myApp').controller('loginController',
    ['$scope', 'AuthService', '$state', '$rootScope',
        function ($scope, AuthService, $state, $rootScope) {

            if (localStorage.getItem('username') && localStorage.getItem('password')) {
                $scope.username = localStorage.getItem('username');
                $scope.password = localStorage.getItem('password');
            }

            $scope.login = function () {

                $scope.error = false;

                AuthService.login($scope.username, $scope.password)
                    .then(function (data) {
                        $rootScope.userRole = data.role;
                        if ($scope.remember) {
                            localStorage.setItem('username', $scope.username);
                            localStorage.setItem('password', $scope.password);
                        }
                        else {
                            localStorage.clear();
                        }
                        localStorage.setItem('role', data.role);
                        $state.go('user.profile',{},{reload:true});
                    })
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                    });
            };

            $scope.showRegister = function () {
                $state.go('anon.register');
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
angular.module('myApp').controller('mainController',
    ['$scope', '$rootScope',
        function ($scope, $rootScope) {
            $scope.user_list = false;
            if (localStorage.getItem('role') === 'admin') {
                $scope.user_list = true;
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
angular.module('myApp').controller('profileController',
    ['$scope', '$state', '$location', 'AuthService', 'FileUploader', '$http',
        function ($scope, $state, $location, AuthService, FileUploader, $http) {

            $scope.showForm = function () {
               $scope.formProfile = !$scope.formProfile;
               $scope.editProfile();
            };


            $http.get('/profile', {cache: false})
                // handle success
                .success(function (data) {
                    $scope.name = data.name;
                    $scope.email = data.email;
                    $scope.image = data.image;
                    $scope.description = data.description;
                })
                // handle error
                .error(function (data) {
                    console.log(data);
                });

            $scope.profile = function () {
                console.log(1);
               AuthService.profile()
                   .then(function (data) {
                       console.log(data);
                       $scope.name = data.name;
                       $scope.email = data.email;
                       $scope.image = data.image;
                       $scope.description = data.description;
                   });
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

                $scope.error = false;

                AuthService.register($scope.registerForm.username, $scope.registerForm.email, $scope.registerForm.password)
                    .then(function () {
                        AuthService.login($scope.registerForm.username, $scope.registerForm.password)
                            .then(function () {
                                $location.path('/user_profile');
                            });
                    })
                    .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "This name of user exists!";
                    });
            };
        }
    ]
);
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
