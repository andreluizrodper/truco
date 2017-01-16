angular
.module("game")
.controller("game", function($scope, $route, $routeParams, $location, $http){
    $scope.game = [];
    $scope.game.list = [];
    $scope.game.table = [];
    $scope.game.table.turn = false;
    $scope.game.status = false;
    $scope.game.new = function(){
        $scope.game.data = {"limit": false, "status": false, "users": [$scope.user.data.name], "user": $scope.user.data.name};
        $scope.game.list.push($scope.game.data);
        socket.emit("gameNew", $scope.game.data);
    }
    $scope.game.start = function(item){
        $scope.game.status = true;
        socket.emit("gameStart", item);
    }
    $scope.game.getIn = function(item){
        item.users.push($scope.user.data.name);
        socket.emit("gameGetIn", item);
    }
    $scope.game.makePlay = function(item){
        if($scope.game.table.turn){
            for(var a in $scope.game.myCards){
                console.log($scope.game.myCards[a], item);
                if(
                    $scope.game.myCards[a].type == item.type && 
                    $scope.game.myCards[a].number == item.number
                )
                    $scope.game.myCards[a].status = true;
            }
            socket.emit("makePlay", {card: item, user: $scope.user.data.name});
        }
    }
    socket.on("gameNew", function(data){
        $scope.$apply(function(){
            $scope.game.list = data;
        });
    })
    .on("gameGetIn", function(data){
        $scope.$apply(function(){
            $scope.game.list = data;
        });
    })
    .on("endGame", function(data){
        $scope.$apply(function(){
            $scope.game.list = data;
        });
    })
    .on("gameStart", function(main, cards, users){
        $scope.$apply(function(){
            $scope.game.cardMain = main;
            for(var a in users){
                if(users[a] == $scope.user.data.name){
                    $scope.game.myCards = cards[a];
                }
            }
            if(users[0] == $scope.user.data.name)
                $scope.game.table.turn = true;
        });
    })
    .on("makePlay", function(round, cards, user, name, item){
        $scope.$apply(function(){
            $scope.game.table.turn = false;
            if(user == $scope.user.data.name)
                $scope.game.table.turn = true;
            if($scope.game.table.round == undefined)
                $scope.game.table.round = [];
            if($scope.game.table.round[round] == undefined)
                $scope.game.table.round[round] = [];
            $scope.game.table.round[round].name = name;
            if($scope.game.table.round[round].cards == undefined)
                $scope.game.table.round[round].cards = [];
            $scope.game.table.round[round].cards = cards;
        });
    })
    .on("endGame", function(msg){
        $scope.game.table.turn = false;
    });
});