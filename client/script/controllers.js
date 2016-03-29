angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    console.log('sadasd');

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function (token) {
          localStorage.setItem('token', token);
          $location.path('/profile');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };

    $scope.showRegister = function() {
      $location.path('/register');
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

}]);

angular.module('myApp').controller('profileController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.showForm = function () {
      $scope.formProfile = !$scope.formProfile;
    };

    $scope.profile = function () {
      AuthService.profile()
        .then(function (data) {
           $scope.name = data.name;
           $scope.email = data.email;
           $scope.description = data.description;
        })
    };

    $scope.editProfile = function () {
      AuthService.editProfile($scope.name, $scope.email, $scope.description)
        .then(function (data) {
           console.log(data);
        })
    };

}]);

angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.email, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);
