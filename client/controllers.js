angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
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

}]);

angular.module('myApp').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

angular.module('myApp').controller('profileController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.toggle = function () {
      $scope.myVar = !$scope.myVar;
    };
    $scope.profile = function () {
      AuthService.profile()
        .then(function (data) {
           console.log(data.name);
           $scope.name = data.name;
           $scope.email = data.email;
           $scope.description = data.description;
        })
    }

}]);

angular.module('myApp').controller('profileController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    console.log($scope.name);
    $scope.editProfile = function () {
      AuthService.editProfile($scope.name, $scope.email, $scope.description)
        .then(function (data) {
           console.log(data);
        })
    }

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
          // $scope.disabled = false;
          // $scope.registerForm = {};
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
