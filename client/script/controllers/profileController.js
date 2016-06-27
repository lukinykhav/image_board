angular.module('myApp').controller('profileController',
    ['$scope', '$location', 'AuthService', 'FileUploader',
        function ($scope, $location, AuthService, FileUploader) {

            $scope.showForm = function () {
                $scope.formProfile = !$scope.formProfile;
                $scope.editProfile();
            };

            $scope.profile = function () {
                AuthService.profile()
                    .then(function (data) {
                        $scope.name = data.name;
                        $scope.email = data.email;
                        $scope.image = data.image;
                        $scope.description = data.description;
                    })
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