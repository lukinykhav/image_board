var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      access: {restricted: true}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: true}
    })
    .when('/profile', {
      templateUrl: 'partials/profile.html',
      controller: 'profileController',
      access: {restricted: true}
    })
    // .when('/editProfile', {
    //   controller: 'profileController',
    //   access: {restricted: true}
    // })
    .otherwise({
      redirectTo: '/'
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  
//   $rootScope.$on('$routeChangeStart',
//     function (event, next, current) {
//       AuthService.getUserStatus();
//       if (next.access.restricted &&
//           !AuthService.isLoggedIn()) {
//         $location.path('/login');
//         $route.reload();
//       }
//   });
});
