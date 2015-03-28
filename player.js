var Player = (function() {
    function Player(x, y) {
        this.position = new Vector2(x, y);
        this.speed = 5;
        this.width = 50;
        this.height = 50;
        this.movement = {right: false, left: false, up: false, down: false};
        this.rect = new Rectangle(x, y, this.width, this.height);
        this.animation = new Animation(this.width, this.height, 0, 0, 1, 'paddles.PNG', 20, 1, 2);
        this.animation.position = this.position;
    }

    Player.prototype.move = function(width) {
        if (this.movement.left && this.position.x > 0) {
            this.position.move(new Vector2(-this.speed, 0));
        } else if (this.movement.right && this.position.x + this.width < width) {
            this.position.move(new Vector2(this.speed, 0));
        }

        if (this.movement.up) {
            this.position.move(new Vector2(0, -this.speed));
        } else if (this.movement.down) {
            this.position.move(new Vector2(0, this.speed));
        }

        this.animation.position = this.position;
        this.rect.x = this.position.x;
        this.rect.y = this.position.y;
    };

    return Player;
}());