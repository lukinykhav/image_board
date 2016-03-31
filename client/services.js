angular.module('myApp').factory('AuthService',
  ['$customHttp', '$q', '$timeout', '$http',
  function ($customHttp, $q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      profile: profile,
      editProfile: editProfile
    });

    function isLoggedIn() {
      console.log(user);
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      var deferred = $q.defer();

      $http.get('/user/status')
      // handle success
      .success(function (data) {
        if(data){
          user = true;
        } else {
          user = false;
        }
        deferred.resolve(user);
      })
      // handle error
      .error(function (data) {
        user = false;
      });

      return deferred.promise;
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            deferred.resolve(data.token);
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, email, password) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register',
        {username: username, email: email, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function profile() {
      var deferred = $q.defer();

      $customHttp.addToken();
      // send a get request to the server
      $http.get('/user/profile')
        // handle success
        .success(function (data) {
          deferred.resolve(data);
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;  
    }

    function editProfile(name, email, description) {
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/profile',
        {name: name, email: email, description: description})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    }

}]);

angular.module('myApp').service('$customHttp', ['$http', function ($http) {
  this.addToken = function () {
        var token = localStorage.getItem('token');
        if(token) {
          $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
        }
        else {
          $http.defaults.headers.common['Authorization'] = 'Basic ';
        }
        
      }
}]);


angular.module('myApp').directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    // console.info(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
        
    }
}])