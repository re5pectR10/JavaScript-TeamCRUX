var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var player1points = document.getElementById('points');
var player1lives = document.getElementById('lives');

var _cellSize = 50;
var field = [];
var enemies = [];
var points = [];
var bonuses = [];
var possibleMoves, currentMove, forbiddenMove, powerModeStartTime, level = 1;

var input = new Input();
attachListeners(input);

var player = new Player(50, 50, 45, 'assets/pacman.png', 0, 2);

/* initialize the field */
function initField() {
    for (var i = 0; i < canvas.width / _cellSize; i++) {
        for (var j = 0; j < canvas.height / _cellSize; j++) {

            if ((i == Math.floor(canvas.width / _cellSize / 2) && j == 0) || (i == Math.floor(canvas.width / _cellSize / 2) && j == canvas.height / _cellSize - 1) ||
                (i == 0 && j == Math.floor(canvas.height / _cellSize / 2)) || (i == canvas.width / _cellSize - 1 && j == Math.floor(canvas.height / _cellSize / 2))) {
                continue;
            }

            if (i == 0 && j == 0) {
                field.push(new Wall(i, j, 8));
            } else if (i == canvas.width / _cellSize - 1 && j == 0) {
                field.push(new Wall(i, j, 9));
            } else if (i == 0 && j == canvas.height / _cellSize - 1) {
                field.push(new Wall(i, j, 6));
            } else if (i == canvas.width / _cellSize - 1 && j == canvas.height / _cellSize - 1) {
                field.push(new Wall(i, j, 7));
            } else if (j == 0 || j == canvas.height / _cellSize - 1) {
                field.push(new Wall(i, j, 4));
            } else if (i == 0 || i == canvas.width / _cellSize - 1) {
                field.push(new Wall(i, j, 10));
            } else if (i % 2 == 0 && j % 2 == 0) {
                field.push(new Wall(i, j, 11));
            } else if ((i == 1 && j == canvas.height / _cellSize - 2) ||
                (i == canvas.width / _cellSize - 2 && j == canvas.height / _cellSize - 2) ||
                (i == 1 && j == 1) ||
                (i == canvas.width / _cellSize - 2 && j == 1)) {
            } else {
                points.push(new Point(i, j));
            }
        }
    }
}

function initEnemies() {
    for (var i = 0; i < 4; i++) {
        enemies.push(new Ghost(700, 50, 50, 'assets/pac.png', i * 2, 14));
    }
}

function fillBonuses() {
    bonuses.push(new Bonus(1, 1));
    bonuses.push(new Bonus(1, canvas.height / _cellSize - 2));
    bonuses.push(new Bonus(canvas.width / _cellSize - 2, canvas.height / _cellSize - 2));
    bonuses.push(new Bonus(canvas.width / _cellSize - 2, 1));
}

function update() {
    tick();
    render(ctx);
    checkDead(player);
    movement(player);
    updatePoints(player);
    updateBonuses(player);
    player1points.innerHTML = player.points;
    player1lives.innerHTML = player.lives;

    if (powerModeStartTime + 7 < new Date().getTime() / 1000) {
        disablePowerMode(player);
    }

    enemies.forEach(function(el) {
       AI(el);
    });
    requestAnimationFrame(update);
}

function enablePowerMode(player) {
    enemies.forEach(function(el) {
        el.setPowerMode();
        player.powerMode = true;
    });
}

function disablePowerMode(player) {
    enemies.forEach(function(el) {
        el.unsetPowerMode();
        player.powerMode = false;
    });
}

function updatePoints(player) {
    var pointForRemove;

    if (points.length == 0) {
        initField();
        fillBonuses();
        player.setStartPosition();
    }

    points.forEach(function(el) {
       if (el.rect.intersects(player.rect)) {
           player.points += 10;
           pointForRemove = el;
       }
    });

    if (pointForRemove) {
        points.removeAt(points.indexOf(pointForRemove));
    }
}

function updateBonuses(player) {
    var bonusForRemove;

    bonuses.forEach(function(el) {
        if (el.rect.intersects(player.rect)) {
            enablePowerMode(player);
            powerModeStartTime = new Date().getTime() / 1000;
            bonusForRemove = el;
        }
    });

    if (bonusForRemove) {
        bonuses.removeAt(bonuses.indexOf(bonusForRemove));
        if (bonuses === undefined || bonuses.length == 0) {
            setTimeout(fillBonuses, 5000);
            //fillBonuses();
        }
    }
}

function checkDead(player) {
    enemies.forEach(function(el) {
       if (el.rect.intersects(player.rect)) {
           if (player.powerMode && el.powerMode) {
               el.position = new Vector2(700, 50);
               el.unsetPowerMode();
               player.points += 50;
           } else {
               if (player.lives == 0) {
                   // end game
               } else {
                   player.lives--;
                   player.setStartPosition();
               }
           }
       }
    });
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

    updateAnimationDirection(player);
    player.move(canvas.width);
}

function updateAnimationDirection(player) {
    if (player.movement.left) {
        player.animation.setRow(2);
    } else if (player.movement.up) {
        player.animation.setRow(3);
    } else if (player.movement.right) {
        player.animation.setRow(0);
    } else if (player.movement.down) {
        player.animation.setRow(1);
    }
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
    field.forEach(function(el){
       el.animation.update();
    });
    points.forEach(function(el) {
        el.animation.update();
    });
    bonuses.forEach(function(el) {
        el.animation.update();
    });
}

function render(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    field.forEach(function(el) {
       el.animation.draw(ctx);
    });

    points.forEach(function(el) {
        el.animation.draw(ctx);
    });

    bonuses.forEach(function(el) {
        el.animation.draw(ctx);
    });

    enemies.forEach(function(el){
        el.animation.draw(ctx);
    });
    player.animation.draw(ctx);
}

initField();
fillBonuses();
initEnemies();
update();