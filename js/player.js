var Player = (function() {
    function Player(x, y, size, spritePath, col, allCols) {
        this.position = new Vector2(x, y);
        this.speed = 5;
        this.width = size;
        this.height = size;
        this.points = 0;
        this.lives = 3;
        this.powerMode = false;
        this.movement = {right: false, left: false, up: false, down: false};
        this.rect = new Rectangle(x, y, this.width, this.height);
        this.animation = new Animation(this.width, this.height, 0, col, 2, spritePath, 4, allCols, 4);
        this.animation.position = this.position;
    }

    Player.prototype.reset = function() {
        this.points = 0;
        this.lives = 3;
        this.powerMode = false;
    };

    Player.prototype.setStartPosition = function() {
        this.position = new Vector2(255, 255);
    };

    Player.prototype.move = function(width) {
        if (this.movement.left) {
            this.position.move(new Vector2(-this.speed, 0));
        } else if (this.movement.right) {
            this.position.move(new Vector2(this.speed, 0));
        }

        if (this.movement.up) {
            this.position.move(new Vector2(0, -this.speed));
        } else if (this.movement.down) {
            this.position.move(new Vector2(0, this.speed));
        }

        if (this.position.y < 0) {
            this.position.y = canvas.height - 5;
        }

        if (this.position.y > canvas.height) {
            this.position.y = 5;
        }

        if (this.position.x > canvas.width) {
            this.position.x = 5;
        }

        if (this.position.x < 0) {
            this.position.x = canvas.width - 5;
        }

        this.animation.position = this.position;
        this.rect.x = this.position.x;
        this.rect.y = this.position.y;
    };

    return Player;
}());