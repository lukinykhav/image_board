angular.module('myApp').controller('profileController',
    ['$scope', '$location', 'AuthService', 'FileUploader', '$http', '$route',
        function ($scope, $location, AuthService, FileUploade, $http, $route) {

            //$scope.showForm = function () {
            //    $scope.formProfile = !$scope.formProfile;
            //    $scope.editProfile();
            //};
            // $route.reload();

            $http.get('/profile', {cache: false})
                // handle success
                .success(function (data) {
                    console.log(3);
                    $scope.name = data.name;
                    $scope.email = data.email;
                    $scope.image = data.image;
                    $scope.description = data.description;
                })
                // handle error
                .error(function (data) {
                    console.log(4);
                });

            //$scope.profile = function () {
            //    AuthService.profile()
            //        .then(function (data) {
            //            console.log(data);
            //            $scope.name = data.name;
            //            $scope.email = data.email;
            //            $scope.image = data.image;
            //            $scope.description = data.description;
            //        });
            //};

            //$scope.editProfile = function () {
            //    AuthService.editProfile($scope.name, $scope.email, $scope.description)
            //        .then(function (data) {
            //            console.log(data);
            //        })
            //};
            //
            //$scope.uploader = new FileUploader({
            //    url: '/load_avatar',
            //    autoUpload: true
            //});
        }
    ]
);