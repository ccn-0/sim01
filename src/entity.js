class Entity {
    // Abstract entity
    static __eid = 0;
    constructor() {
        this.eid = Entity.__eid++;
        world.entities.push(this);
    }
    update() {}
}

class PhysicalEntity extends Entity {
    // Physical entity that has basic physical properties
    constructor(x, y, vx, vy, ax, ay, size) {
        super();
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.size = size;
        this.color = "#FFFFFF";
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

    }
}

class DurationEntity extends PhysicalEntity {
    // Entity that loses hp every frame
    constructor(x, y, vx, vy, ax, ay, size, max_hp) {
        super(x, y, vx, vy, ax, ay, size);
        this.max_hp = max_hp;
        this.hp = max_hp;
    }

    update() {
        super.update();
        this.hp--;
    }
}