class CameraEntity extends Entity {
    constructor(player) {
        super();
        this.x;
        this.y;
        this.player = player;
        this.update();
        world.camera = this;
    }

    update() {
        this.x = this.player.x;
        this.y = this.player.y;
    }
}