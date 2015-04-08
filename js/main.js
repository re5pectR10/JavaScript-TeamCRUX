var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var playerLives = document.querySelectorAll('.lives');
var lvl = document.getElementById('lvl');
var playerBullets = document.querySelectorAll('.bullets');
var playersPoints = document.querySelectorAll('.points');
var finalResults = document.querySelectorAll('.result');

var _cellSize = 50;
var field = [], enemies = [], points = [], bonuses = [];
var possibleMoves, currentMove, forbiddenMove, level = 0, twoPlayer = false;

var input = new Input();
attachListeners(input);

var players = [];

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

    level++;
    lvl.innerHTML = "Level: " + level;
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
    players.forEach(function(player) {
        checkEnemyCollision(player);
        updatePoints(player);
        updateBonuses(player);
        updateBullets(player);
        updatePowerMode(player);
        if (player.ID == 0) {
            movement(player, true);
        } else {
            movement(player, false);
        }
    });

    updateStats(players);
    enemies.forEach(function(el) {
       AI(el);
    });

    requestAnimationFrame(update);
}

function updateStats(players) {
    players.forEach(function(el) {
        playerLives[el.ID].innerHTML = "Lives: " + el.lives;
        playerBullets[el.ID].innerHTML = "Bullets: " + el.bullets;
        playersPoints[el.ID].innerHTML = 'Points: ' + el.points;
        finalResults[el.ID].innerHTML = 'Your result is: ' + el.points + ' points'
    });
}

function updatePowerMode(player) {
    if (player.powerMode && player.powerModeStartTime + 7 < new Date().getTime() / 1000) {
        disablePowerMode(player);
    }
}

function enablePowerMode(player) {
    player.powerMode = true;
    enemies.forEach(function(el) {
        el.setPowerMode();
    });
}

function disablePowerMode(player) {
    player.powerMode = false;
    enemies.forEach(function(el) {
        el.unsetPowerMode();
    });
}

function updateBullets(player) {
    var bulletForRemove;
    player.firedBullets.forEach(function(bullet) {
        bullet.move();
        enemies.forEach(function(enemie) {
            if (enemie.rect.intersects(bullet.rect)) {
                enemie.setDefaultPosition();
                enemie.unsetPowerMode();
                player.points += 5;
                bulletForRemove = bullet;
            }
        });

        players.forEach(function(el) {
            if (el !== player && el.rect.intersects(bullet.rect)) {
                el.setStartPosition();
                player.points += 10;
                el.lives--;
                bulletForRemove = bullet;
            }
        });

        field.forEach(function(el) {
            if (el.rect.intersects(bullet.rect)) {
                bulletForRemove = bullet;
            }
        })
    });

    if (bulletForRemove) {
        player.firedBullets.removeAt(player.firedBullets.indexOf(bulletForRemove));
    }
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
           player.points += 1;
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
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    enablePowerMode(player);
                    player.powerModeStartTime = new Date().getTime() / 1000;
                    break;
                case 1:
                    player.lives++;
                    break;
                case 2:
                    player.bullets += 3;
                    break;
            }

            bonusForRemove = el;
        }
    });

    if (bonusForRemove) {
        bonuses.removeAt(bonuses.indexOf(bonusForRemove));
        if (bonuses === undefined || bonuses.length == 0) {
            setTimeout(fillBonuses, 5000);
        }
    }
}

function showResult(el) {
    el.style.display = 'block';
}

function checkPlayersCollision(player) {
    players.forEach(function(el) {
       if (el !== player) {
           if (el.rect.intersects(player.rect)) {
               if (!player.powerMode && !el.powerMode) {
                   player.lives--;
                   player.setStartPosition();
                   el.lives--;
                   el.setStartPosition();
               } else if (!player.powerMode) {
                   player.lives--;
                   player.setStartPosition();
                   el.points += 10;
               } else if (!el.powerMode) {
                   el.lives--;
                   el.setStartPosition();
                   player.points += 10;
               }
           }
       }
    });
}

function checkEnemyCollision(player) {
    enemies.forEach(function(el) {
       if (el.rect.intersects(player.rect)) {
           if (player.powerMode && el.powerMode) {
               el.setDefaultPosition();
               el.unsetPowerMode();
               player.points += 5;
           } else {
               player.lives--;
               enemies.forEach(function(el) {
                   el.position = new Vector2(700, 50);
               });

               player.setStartPosition();
           }
       }
    });

    checkPlayersCollision(player);
    checkDead(player);
}

function checkDead(player) {
    if (player.lives < 0) {
        players.removeAt(players.indexOf(player));
    }

    if (players.length === 0) {
        showResult(endGame);
    }
}

function AI(enemy) {
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
   enemy.move();
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function movement(player, onePlayer) {
    var keys;
    onePlayer ? keys = ['left', 'right', 'up', 'down', 'space'] : keys = ['a', 'd', 'w', 's', 'f'];

    input[keys[0]] ? player.movement.left = true : player.movement.left = false;
    input[keys[1]] ? player.movement.right = true : player.movement.right = false;
    input[keys[2]] ? player.movement.up = true : player.movement.up = false;
    input[keys[3]] ? player.movement.down = true : player.movement.down = false;
    input[keys[4]] ? player.shoot = true : player.shoot = false;

    var cantMove = checkMove(player);
    for (var move in cantMove) {
        player.movement[move] = false;
    }

    updateAnimationDirection(player);
    player.move();
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
    players.forEach(function(player) {
        if (player.powerMode) {
            player.powerModeAnimationUpdatePosition();
            player.powerModeAnimation.update();
        }

        player.animation.update();
        player.firedBullets.forEach(function(el) {
            el.animation.update();
        });
    });

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
    players.forEach(function(player) {
        if (player.powerMode) {
            player.powerModeAnimation.draw(ctx);
        }

        player.animation.draw(ctx);
        player.firedBullets.forEach(function(el) {
            el.animation.draw(ctx);
        });
    });
}

function reset() {
    field = [];
    enemies = [];
    points = [];
    bonuses = [];
    level = 0;
    initField();
    initEnemies();
    fillBonuses();
    if (players.length === 0) {
        players.push(new Player(255, 255, 0, 45, 'assets/pacman.png', 0, 2));
    }

    if (twoPlayer && players.length === 1) {
        players.push(new Player(555, 455, 1, 45, 'assets/pacman2.png', 0, 2));
    } else if (!twoPlayer && players.length == 2) {
        players.removeAt(1);
    }

    players.forEach(function(player) {
        player.reset();
        player.setStartPosition();
    });
}

update();