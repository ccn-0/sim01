class Entity {
    // Abstract entity
    static __eid = 0;
    constructor() {
        this.eid = Entity.__eid++;
        this.max_hp = 1;
        this.hp = 1;
        world.spawn.entities_to_spawn.push(this);
    }
    update() {}
}

class PhysicalEntity extends Entity {
    // Physical entity that has basic physical properties
    constructor(x, y, vx, vy, ax, ay, size, solid) {
        super();
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.size = size;
        this.solid = solid;
        this.color = "#FFFFFF";
        this.frame_alive = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.frame_alive += 1;
    }

}

class DurationEntity extends PhysicalEntity {
    // Entity that loses hp every frame
    constructor(x, y, vx, vy, ax, ay, size, solid, max_hp) {
        super(x, y, vx, vy, ax, ay, size, solid);
        this.max_hp = max_hp;
        this.hp = max_hp;
    }

    update() {
        super.update();
        this.hp--;
    }
}