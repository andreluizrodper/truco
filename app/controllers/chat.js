angular
.module("game")
.controller("chat", function($scope, $route, $routeParams, $location, $http){
    $scope.chat = [];
    $scope.chat.list = [];
    $scope.chat.msg = function(){
        $scope.chat.data = {"user": $scope.user.data.name, "msg": $scope.chat.form.msg};
        $scope.chat.form.msg = "";
        socket.emit("msg", $scope.chat.data);
    }
    socket.on("msg", function(data){
        $scope.$apply(function(){
            $scope.chat.list = data;
        });
    });
});