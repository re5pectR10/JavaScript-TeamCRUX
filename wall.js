var Wall = (function() {
    function Wall(i, j) {
        this.position = new Vector2(i * _cellSize, j * _cellSize);
        this.width = _cellSize;
        this.height = _cellSize;
        this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);

    }

    Wall.prototype.draw = function(ctx) {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fill();
    };

    return Wall;
}());