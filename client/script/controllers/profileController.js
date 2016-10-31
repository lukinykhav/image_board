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