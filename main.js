var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var _cellSize = 50;
var field = [];
for (var i = 0; i < canvas.width / _cellSize; i++) {
    for (var j = 0; j < canvas.height / _cellSize; j++) {
        if (i == 0 || i == canvas.width / _cellSize - 1 || j == canvas.height / _cellSize - 1 || j == 0 ||
            (i % 2 == 0 && j % 2 == 0)){
            field.push(new Wall(i, j));
        }
    }
}

var player = new Player(50, 50);
var enemy = new Player(700, 50);
var enemy2 = new Player(700, 50);

var input = new Input();
attachListeners(input);

function update() {
    tick();
    render(ctx);
    movement();
    AI(enemy);
    AI(enemy2);
    requestAnimationFrame(update);
}

function AI(enemy) {
   /* if (
        ((enemy.movement['up'] === false && enemy.movement['down'] === false) || (enemy.movement['right'] === false && enemy.movement['left'] === false))) {
       // do {
            //enemy.movement['up'] = false;
            //enemy.movement['left'] = false;
            //enemy.movement['right'] = false;
           // enemy.movement['down'] = false;

        if (Math.abs(timeDiff - new Date().getTime()/1000) > 2) {
            enemy. movement.left = !enemy. movement.left;
            enemy. movement.right = !enemy. movement.left;
        }
        if (Math.abs(timeDiff - new Date().getTime()/1000) > 3) {
            enemy. movement.up = !enemy. movement.up;
            enemy. movement.down = !enemy. movement.up;
        }

        if (enemy.movement['down'] === false && enemy.movement['up'] === false) {
            enemy.movement[Object.keys(enemy.movement)[Math.floor(Math.random() * 2) + 2]] = true;
        }
        if (enemy.movement['left'] === false && enemy.movement['right'] === false) {
            enemy.movement[Object.keys(enemy.movement)[Math.floor(Math.random() * 2)]] = true;
        }
            //enemy.movement[Object.keys(enemy.movement)[Math.floor(Math.random() * 4)]] = true;
            //console.log(Object.keys(enemy.movement)[Math.floor(Math.random() * 4)]);

       // } while (enemy.movement['up'] === false && enemy.movement['left'] === false && enemy.movement['right'] === false && enemy.movement['down'] === false)


        timeDiff = new Date().getTime() / 1000;
    }*/

    var possibleMoves = checkMove2(enemy);
    /*var cantMove = possibleMoves.filter(function(el) {
       return el === false;
    });*/
    var currentMove;
    for (var key in enemy.movement) {
        if (enemy.movement[key] === true) {
            currentMove = key;
        }
        //enemy.movement[key] = false;
    }
    //console.log(currentMove);
    var forbiddenMove;
    if (currentMove === 'left') {
        forbiddenMove = 'right';
    } else if (currentMove === 'right') {
        forbiddenMove = 'left';
    } else if (currentMove === 'up') {
        forbiddenMove = 'down';
    } else if (currentMove === 'down') {
        forbiddenMove = 'up';
    }

        var canMove = (function() {
        var out = {};
        for (var i in enemy.movement) {//console.log(forbiddenMove);
            if (typeof possibleMoves[i] === "undefined" && i !== forbiddenMove) {
                out[i] = true;
            }
        }
        return out;
    }());
    enemy.movement[currentMove] = false;
    //console.log(canMove);
    enemy.movement[Object.keys(canMove)[Math.floor(Math.random() * (Object.size(canMove) - 1))]] = true;
    enemy.move(canvas.width);
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function movement() {
    if (input.left) {
        player.movement.left = true;
    } else {
        player.movement.left = false;
    }

    if (input.right) {
        player.movement.right = true;
    } else {
        player.movement.right = false;
    }

    if (input.up) {
        player.movement.up = true;
    } else {
        player.movement.up = false;
    }

    if (input.down) {
        player.movement.down = true;
    } else {
        player.movement.down = false;
    }

    checkMove(player);

    player.move(canvas.width);
}

function checkMove2(player) {
    var obj = {};
    field.forEach(function(el) {
        if (el.rect.intersects(player.rect)) {
            if (el.position.x > player.position.x && el.position.y < player.position.y + player.height && el.position.y + el.height > player.position.y) {
                //player.movement.right = false;
                obj.right = false;
            }
            if (el.position.x < player.position.x && el.position.y < player.position.y + player.height && el.position.y + el.height > player.position.y) {
                //player.movement.left = false;
                obj.left = false;
            }
            if (el.position.y < player.position.y && el.position.x < player.position.x + player.width && el.position.x + el.width > player.position.x) {
                //player.movement.up = false;
                obj.up = false;
            }
            if (el.position.y > player.position.y && el.position.x < player.position.x + player.width && el.position.x + el.width > player.position.x) {
               // player.movement.down = false;
                obj.down = false;
            }
        }
    });
    return obj;
}
function checkMove(player) {
    field.forEach(function(el) {
        if (el.rect.intersects(player.rect)) {
            if (el.position.x > player.position.x && el.position.y < player.position.y + player.height && el.position.y + el.height > player.position.y) {
                player.movement.right = false;
            }
            if (el.position.x < player.position.x && el.position.y < player.position.y + player.height && el.position.y + el.height > player.position.y) {
                player.movement.left = false;
            }
            if (el.position.y < player.position.y && el.position.x < player.position.x + player.width && el.position.x + el.width > player.position.x) {
                player.movement.up = false;
            }
            if (el.position.y > player.position.y && el.position.x < player.position.x + player.width && el.position.x + el.width > player.position.x) {
                player.movement.down = false;
            }
        }
    });
}

function tick() {
    //ball.animation.update();
    player.animation.update();
    enemy.animation.update(); enemy2.animation.update();
    //player2.animation.update();
    //ball.move(canvas.width, canvas.height);
}

function render(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    field.forEach(function(el) {
       el.draw(ctx);
    });

    enemy.animation.draw(ctx);enemy2.animation.draw(ctx);
    player.animation.draw(ctx);
}

update();