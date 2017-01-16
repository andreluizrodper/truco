angular
.module("game")
.controller("user", function($scope, $route, $routeParams, $location, $http){
    $scope.user = [];
    $scope.user.list = [];
    $scope.user.data = [];
    $scope.user.status = false;
    $scope.user.login = function(){
        if($scope.user.form.name != ""){
            $scope.user.status = true;
            $scope.user.data.name = $scope.user.form.name;
            socket.emit("login", {"name": $scope.user.form.name});
        }
    }
    socket.on("save", function(data){
        $scope.$apply(function(){
            $scope.user.list = data;
        });
    });
});