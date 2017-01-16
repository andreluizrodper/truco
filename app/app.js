var socket = io("http://172.16.0.157:3000");
angular
.module("game", ["ngRoute"])
.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "app/templates/main.html",
            controller: "main"
        });
})
.directive("user", function(){
    return {
        templateUrl: "app/templates/user.html",
        controller: "user"
    }
})
.directive("game", function(){
    return {
        templateUrl: "app/templates/game.html",
        controller: "game"
    }
})
.directive("chat", function(){
    return {
        templateUrl: "app/templates/chat.html",
        controller: "chat"
    }
});