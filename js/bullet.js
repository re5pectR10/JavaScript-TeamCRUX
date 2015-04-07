var Bullet = (function() {
    function Bullet(x , y, animationRow) {
        this.position = new Vector2(x + 7, y + 7);
        this.speed = 10;
        this.width = _cellSize - 14;
        this.height = _cellSize - 14;
        this.movement = {right: false, left: false, up: false, down: false};
        var col;
        switch (animationRow) {
            case 2:
                this.movement.left = true;
                col = 0;
                break;
            case 3:
                this.movement.up = true;
                col = 3;
                break;
            case 1:
                this.movement.down = true;
                col = 2;
                break;
            case 0:
                this.movement.right = true;
                col = 1;
                break;
        }
        this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
        this.animation = new Animation(this.width, this.height, 0, col, 1, 'assets/bullets.png', 1, 4, 1);
        this.animation.position = this.position;
    }

    Bullet.prototype.move = function() {
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
            this.position.y = canvas.height;
        }

        if (this.position.y > canvas.height) {
            this.position.y = 0;
        }

        if (this.position.x > canvas.width) {
            this.position.x = 0;
        }

        if (this.position.x < 0) {
            this.position.x = canvas.width;
        }

        this.animation.position = this.position;
        this.rect.x = this.position.x;
        this.rect.y = this.position.y;
    };

    return Bullet;
}());