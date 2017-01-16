var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    users = [],
    chat = [],
    game = [],
    table = [],
    gameCards = [],
    shuffleCards = [],
    cards = [
        {"number":"a","type":1},{"number":"a","type":2},{"number":"a","type":3},{"number":"a","type":4},
        {"number":"2","type":1},{"number":"2","type":2},{"number":"2","type":3},{"number":"2","type":4},
        {"number":"3","type":1},{"number":"3","type":2},{"number":"3","type":3},{"number":"3","type":4},
        {"number":"q","type":1},{"number":"q","type":2},{"number":"q","type":3},{"number":"q","type":4},
        {"number":"j","type":1},{"number":"j","type":2},{"number":"j","type":3},{"number":"j","type":4},
        {"number":"k","type":1},{"number":"k","type":2},{"number":"k","type":3},{"number":"k","type":4},
    ],
    endGame = false;

http.listen(3000);

io.on('connection', function(socket){
    socket.on('login', function(data){
        users.push(data);
        socket.broadcast.emit('login', users);
    })
    .on('msg', function(data){
        chat.push(data);
        io.emit('msg', chat);
    })
    .on('gameNew', function(data){
        game.push(data);
        socket.broadcast.emit('gameNew', game);
    })
    .on('gameGetIn', function(data){
        limit = false;
        for(var a in game){
            if(data.user == game[a].user)
                game[a] = data;
        }
        if(game[a].user.length == 4)
            limit = true;
        socket.broadcast.emit('gameGetIn', game, limit);
    })
    .on('gameStart', function(data){
        shuffleCards = shuffle(cards);
        gameCards.main = shuffleCards[0];
        gameCards.myCards = [];
        count = 0;
        for(var a in data.users){
            gameCards.myCards[a] = new Array();
            for(var cardGive = 0;cardGive < 3;cardGive++){
                count++;
                gameCards.myCards[a].push(shuffleCards[count]);
            }
        }
        table.round = [];
        table.time = 0;
        table.player = 0;
        table.round[table.time] = [];
        table.round[table.time].play = [];
        table.maxPlayers = data.users.length;
        table.users = data.users;
        gameCards.users = data.users;
        io.emit('gameStart', gameCards.main, gameCards.myCards, gameCards.users);
    })
    .on('makePlay', function(data){
        if(endGame)
            io.emit('endGame', "cabo");
        newTurn = false;
        table.round[table.time].play[table.player] = [];
        table.round[table.time].play[table.player] = data.card;
        table.round[table.time].play[table.player].user = table.users[table.player];
        table.player++;
        if(table.player == table.maxPlayers){
            table.player = 0;
            newTurn = true;
        }
        io.emit('makePlay', table.time, table.round[table.time].play, table.users[table.player], table.time, data.card);
        if(newTurn){
            table.time++;
            table.round[table.time] = [];
            table.round[table.time].play = [];
            if(table.time == 2)
                endGame = true;
        }
    });
});

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}
function getRandom(max, min){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}