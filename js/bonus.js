var Bonus = (function() {
    function Bonus(i, j) {
        this.position = new Vector2(i * _cellSize, j * _cellSize);
        this.width = 50;
        this.height = 50;
        this.power = true;
        this.rect = new Rectangle(this.position.x, this.position.y, this.width, this.height);
        this.animation = new Animation(this.width, this.height, 0, 1, 1, 'assets/field.png', 1, 12, 1);
        this.animation.position = this.position;
    }

    return Bonus;
}());