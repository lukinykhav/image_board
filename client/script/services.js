angular.module('myApp').factory('AuthService',
    ['$customHttp', '$q', '$timeout', '$http',
        function ($customHttp, $q, $timeout, $http) {

            // create user variable
            var user = null;

            // return available functions for use in the controllers
            return ({
                //isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register,
                profile: profile,
                editProfile: editProfile,
                getUserRole: getUserRole
            });

            //function isLoggedIn() {
            //    console.log(user);
            //    if (user) {
            //        return true;
            //    } else {
            //        return false;
            //    }
            //}

            function getUserStatus() {
                var deferred = $q.defer();

                $http.get('/status')
                    // handle success
                    .success(function (data) {
                        if (data) {
                            user = true;
                        } else {
                            user = false;
                        }
                        deferred.resolve(user);
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                    });

                return deferred.promise;
            }

            function login(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/login',
                    {username: username, password: password})
                    // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            user = true;
                            deferred.resolve(data.token);
                        } else {
                            user = false;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/logout')
                    // handle success
                    .success(function (data) {
                        user = false;
                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function register(username, email, password) {
                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/register',
                    {username: username, email: email, password: password})
                    // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function profile() {
                var deferred = $q.defer();

                $customHttp.addToken();
                // send a get request to the server
                $http.get('/profile')
                    // handle success
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    // handle error
                    .error(function () {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

            function editProfile(name, email, description) {
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/profile',
                    {name: name, email: email, description: description})
                    // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

            //could test
            function getUserRole (token) {
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/user_role',
                    {token: token})
                    // handle success
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

        }
    ]
);

angular.module('myApp').service('$customHttp', ['$http', function ($http) {
    this.addToken = function () {
        var token = localStorage.getItem('token');
        $http.defaults.headers.common['Authorization'] = 'Basic ' + (token || '');
    }
}]);


angular.module('myApp').factory('BoardService',
    ['$customHttp', '$q', '$timeout', '$http', '$state',
        function ($customHttp, $q, $timeout, $http, $state) {

            // return available functions for use in the controllers
            return ({
                getBoard: getBoard,
                listBoard: listBoard,
                addBoard: addBoard,
                allBoard: allBoard
            });

            function getBoard(id) {
                var deferred = $q.defer();

                $http.get('/get_board/:' + id)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }

            function listBoard() {
                var deferred = $q.defer();

                $customHttp.addToken();
                // send a get request to the server
                $http.get('/list_board')
                    // handle success
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    // handle error
                    .error(function (err) {
                        console.log(err);
                        deferred.reject(err);
                    });

                // return promise object
                return deferred.promise;
            }

            function addBoard(name, description) {
                var deferred = $q.defer();

                $http.post('/create_board', {name: name, description: description})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });

                return deferred.promise;
            }

            function allBoard() {
                var deferred = $q.defer();

                $http.get('/all_boards')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err) {
                        deferred.reject(err);
                    })
                return deferred.promise;
            }
        }
    ]
);

angular.module('myApp').factory('dataHolder', function(){
    var value = '';
    return {
        updateValue: function(newValue) {
            value = newValue;
        },
        getValue: function() {
            return value;
        }
    }
});

angular.module('myApp').factory('filter', function () {
    return ({
        filterPosts: filterPosts
    });

    function filterPosts (posts) {
        var filtred_posts = [], filtred_comments = [];
        for (var i = 0; i < posts.length; i++) {
            if (posts[i].post_id === "null") {
                filtred_posts.push(posts[i]);
            }
            else {
                filtred_comments.push((posts[i]));
            }
        }
        return {posts: filtred_posts, comments: filtred_comments};
    }
});

angular.module('myApp').service('PostService', ['$http', '$q', function ($http, $q) {
    return ({
        getPost: getPost,
        getUserPost: getUserPost,
        editPost: editPost,
        liking: liking,
        changePost: changePost
    });

    function getPost (id) {
        var deferred = $q.defer();

        $http.get('/get_post/:' + id)
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data) {
                deferred.reject(data);
            });
        
        return deferred.promise;
    }

    function getUserPost (id, token) {
        var post_user_id = [];
        var deferred = $q.defer();

        $http.post('/get_user_post/:' + id, {token: token})
            .success(function (data) {
                for (var i = 0; i < data.posts.length; i++) {
                    post_user_id.push(data.posts[i]._id);
                }
                deferred.resolve([post_user_id, data.user.role]);
            })
            .error(function (data) {
                deferred.reject(data);
            });
        
        return deferred.promise;
    }

    function editPost (post_id, fd) {
        var deferred = $q.defer();

        $http.post('/edit_post/:' + post_id, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(data) {
                 deferred.resolve(data);
            })
            .error(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    function liking (post_id, liking) {
        var deferred = $q.defer();
        $http.post('/like/:' + post_id, {liking: liking})
            .success(function(data) {
                 deferred.resolve(data);
            })
            .error(function(err) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

   function changePost (posts, data) {
        for (var i = 0; i < posts.length; i++) {
            if (posts[i]['_id'] === data._id) {
                if(posts[i]['class'] === 'comment') {
                    data['class'] = 'comment';
                }
                posts[i] = data;
            }
        }
        return posts;
    }
}]);