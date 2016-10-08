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
            // BoardService.getBoard(id)
            //     .then(function successCallback(data) {
            //         filtred = filter.filterPosts(data.posts);
            //         $scope.board_name = data.board.name;
            //         $scope.posts = filtred.posts;
            //         $scope.comments = filtred.comments;
            //         dataHolder.updateValue(data.board._id);
            //         PostService.getUserPost(id, token)
            //             .then(function (data) {
            //                 $scope.userRole = data[1];
            //                 $scope.changePost = data[0];
            //             })
            //     },
            //     function errorCallback(err) {
            //         console.log(err);
            //     });

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
