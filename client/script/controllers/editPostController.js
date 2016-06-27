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