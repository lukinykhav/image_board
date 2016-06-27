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
