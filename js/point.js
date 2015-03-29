var Point = (function() {
    function Point(i, j) {
        this.position = new Vector2(i * _cellSize + 20, j * _cellSize + 20);
        this.width = 15;
        this.height = 15;
        this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
        this.animation = new Animation(this.width, this.height, 0, 0, 2, 'assets/point.png', 1, 0, 0);
        this.animation.position = this.position;
    }

    return Point;
}());