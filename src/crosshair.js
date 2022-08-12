class CrosshairEntity extends Entity {
    constructor(player) {
        super();
        this.color = "#FF0000";
        this.size = 4;
        this.player = player;
        this.update();
    }

    update() {
        this.x = this.player.x + this.player.ax * 36;
        this.y = this.player.y + this.player.ay * 36;
    }
}