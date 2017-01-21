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
                    .success(function(data) {
                        var index;
                        if(data.errorMessage) {
                            $scope.error = true;
                            $scope.errorMessage = "Not valid caption field";
                        }
                        else {
                            if (data.comment.post_id === null) {
                                posts.push(data.comment);
                            }
                            else {
                                data.comment['class'] = 'comment';
                                for (var i = 0; i < posts.length; i++) {
                                    if (posts[i]._id === data.comment.post_id) {
                                        index = i;
                                        posts[i]['children'] = data.parent.children;
                                    }
                                }
                                posts.splice(index+1, 0, data.comment);
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
                //$scope.listBoard();
            };

            // $scope.listBoard = function () {
                BoardService.listBoard()
                    .then(function (data) {
                        $scope.boards = data;
                    });
            // };

            $scope.addBoard = function () {
                BoardService.addBoard($scope.name, $scope.description)
                    .then(function (data) {
                        $scope.boards.push(data.data);
                        $scope.addBoardForm = !$scope.addBoardForm;
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
angular.module('myApp').controller('editPostController',
    ['$scope', '$http', 'locals', '$mdDialog', 'PostService', '$state', function ($scope, $http, locals, $mdDialog, PostService, $state) {

        // var post;
        // for(post in locals.posts) {
        //     if (locals.posts[post]['_id'] === locals.post_id) {
        //         $scope.post = locals.posts[post];
        //     }
        // }

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
                    // if(locals.post || locals.comments) {
                    //     if (locals.post[0]._id === data._id) {
                    //         $scope.posts = PostService.changePost(locals.post, data);
                    //     }
                    //     else {
                    //         $scope.comments = PostService.changePost(locals.comments, data);
                    //     }
                    // }
                    // else {
                    //     $scope.posts = PostService.changePost(locals.posts, data);
                    // }
                    $mdDialog.cancel();
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
                    $scope.post = data;
                    // $scope.posts = PostService.changePost($scope.posts, data);
                })
        };

        $scope.dislike = function (post_id) {
            PostService.liking(post_id, 0)
                .then(function(data) {
                    $scope.post = data;
                    // $scope.posts = PostService.changePost($scope.posts, data);
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
                            if ($rootScope.arr_display.indexOf($scope.posts[i]['_id']) > -1) {
                                $rootScope.arr_display.splice($rootScope.arr_display.indexOf($scope.posts[i]['_id']), 1);
                            }
                            $scope.posts.splice(i, 1);
                            continue;
                        }
                        i++;
                    }
                    $rootScope.arr_display.splice($rootScope.arr_display.indexOf(post_id), 1);
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

            $scope.uploader.onSuccessItem = function() {
                $state.reload();
            };

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
                        $scope.errorMessage = "This name or email of user exists!";
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
