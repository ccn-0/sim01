class Entity {
    static __eid = 0;
    constructor(x, y, physics, graphics) {
        this.eid = Entity.__eid++;
        this.x = x;
        this.y = y;
        this.__physics = physics;
        this.__graphics = graphics;
    }
    update() {
        this.__physics.update();
    }
    draw() {
        this.__graphics.draw();
    }
}