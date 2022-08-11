class CrosshairEntity extends PhysicalEntity {
    constructor(player) {
        super(0, 0, 0, 0, 0, 0, 4);
        this.color = "#FF0000";
        this.player = player;
        this.update();
    }

    update() {
        this.x = this.player.x + this.player.ax * 32;
        this.y = this.player.y + this.player.ay * 32;
    }
}