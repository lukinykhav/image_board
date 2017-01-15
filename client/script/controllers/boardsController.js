angular.module('myApp').controller('boardsController',
    ['$scope', '$location', 'BoardService',
        function ($scope, $location, BoardService) {

            $scope.showAddBoardForm = function () {
                $scope.addBoardForm = !$scope.addBoardForm;
                //$scope.listBoard();
            };

            // $scope.listBoard = function () {
                BoardService.listBoard()
                    .then(function (data) {
                        $scope.boards = data;
                    });
            // };

            $scope.addBoard = function () {
                BoardService.addBoard($scope.name, $scope.description)
                    .then(function (data) {
                        $scope.boards.push(data.data);
                        $scope.addBoardForm = !$scope.addBoardForm;
                    })
                    .catch(function () {
                        $scope.errorMessage = "Error";
                    });
            };

            $scope.showAll = function () {
                BoardService.allBoard()
                    .then(function (data) {
                        $scope.boards = data;
                    })
            }
        }
    ]
);