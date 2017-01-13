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