var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var _cellSize = 50;
var field = [];
var enemies = [];
var possibleMoves, currentMove, forbiddenMove;

/* initialize the field */
for (var i = 0; i < canvas.width / _cellSize; i++) {
    for (var j = 0; j < canvas.height / _cellSize; j++) {
        if (i == 0 || i == canvas.width / _cellSize - 1 || j == canvas.height / _cellSize - 1 || j == 0 ||
            (i % 2 == 0 && j % 2 == 0)){
            field.push(new Wall(i, j));
        }
    }
}

var player = new Player(50, 50, 45);
for (i = 0; i < 3; i++) {
    enemies.push(new Player(700, 50, 50));
}

var input = new Input();
attachListeners(input);

function update() {
    tick();
    render(ctx);
    movement(player);
    enemies.forEach(function(el) {
       AI(el);
    });
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

   for (var key in enemy.movement) {
       if (enemy.movement[key] === true) {
           currentMove = key;
       }
   }

   if (currentMove === 'left') {
       forbiddenMove = 'right';
   } else if (currentMove === 'right') {
       forbiddenMove = 'left';
   } else if (currentMove === 'up') {
       forbiddenMove = 'down';
   } else if (currentMove === 'down') {
       forbiddenMove = 'up';
   }

   possibleMoves = (function() {
       var out = {};
       var impossibleMoves = checkMove(enemy);
       for (var i in enemy.movement) {
           if (typeof impossibleMoves[i] === "undefined" && i !== forbiddenMove) {
               out[i] = true;
           }
       }
       return out;
   }());

   enemy.movement[currentMove] = false;
   enemy.movement[Object.keys(possibleMoves)[Math.floor(Math.random() * (Object.size(possibleMoves) - 1))]] = true;
   enemy.move(canvas.width);
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function movement(player) {
    input.left ? player.movement.left = true : player.movement.left = false;
    input.right ? player.movement.right = true : player.movement.right = false;
    input.up ? player.movement.up = true : player.movement.up = false;
    input.down ? player.movement.down = true : player.movement.down = false;

    var cantMove = checkMove(player);
    for (var move in cantMove) {
        player.movement[move] = false;
    }

    player.move(canvas.width);
}

/* return object with forbidden directions */
function checkMove(player) {
    var obj = {};
    field.forEach(function(el) {
        if (el.rect.intersects(player.rect)) {
            if (el.position.x > player.position.x && el.position.y < player.position.y + player.height && el.position.y + el.height > player.position.y) {
                obj.right = false;
            }
            if (el.position.x < player.position.x && el.position.y < player.position.y + player.height && el.position.y + el.height > player.position.y) {
                obj.left = false;
            }
            if (el.position.y < player.position.y && el.position.x < player.position.x + player.width && el.position.x + el.width > player.position.x) {
                obj.up = false;
            }
            if (el.position.y > player.position.y && el.position.x < player.position.x + player.width && el.position.x + el.width > player.position.x) {
                obj.down = false;
            }
        }
    });
    return obj;
}

function tick() {
    player.animation.update();
    enemies.forEach(function(el){
       el.animation.update();
    });
}

function render(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    field.forEach(function(el) {
       el.draw(ctx);
    });

    enemies.forEach(function(el){
        el.animation.draw(ctx);
    });
    player.animation.draw(ctx);
}

update();