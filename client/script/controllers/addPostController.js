angular.module('myApp').controller('addPostController',
    ['$scope', '$location', '$http', 'dataHolder', '$customHttp', 'usSpinnerService',
        function ($scope, $location, $http, dataHolder, $customHttp, usSpinnerService) {
            var defaultForm = {
                caption: "",
                fiel: "",
                board_id: "",
                post_id: ""
            };

            var textarea =  document.getElementsByClassName('wrap-textarea')[0];

            $scope.startSpin = function(){
                usSpinnerService.spin('spinner');
                textarea.className = 'hide';
                setTimeout(function(){
                    if(document.getElementById('file_input_file').value) {
                        usSpinnerService.stop('spinner');
                        console.log(textarea);
                        textarea.className = 'wrap-textarea';
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
            };
        }
    ]
);