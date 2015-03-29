var Wall = (function() {
    function Wall(i, j, col) {
        this.position = new Vector2(i * _cellSize, j * _cellSize);
        this.width = _cellSize;
        this.height = _cellSize;
        this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
        this.animation = new Animation(this.width, this.height, 0, col, 1, 'assets/field.png', 1, 12, 1);
        this.animation.position = this.position;
    }

    /*Wall.prototype.draw = function(ctx) {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = '#000066';
        ctx.fill();
    };*/

    return Wall;
}());