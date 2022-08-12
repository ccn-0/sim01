class DynamicSpriteEntity extends DurationEntity {
    // Entity for dynamic sprite that fades

    static alpha_min = 0.1;

    constructor(x, y, vx, vy, ax, ay, size, hp, fade_factor, color, model) {
        super(x, y, vx, vy, ax, ay, size, 0, hp);
        this.fade_factor = fade_factor;
        this.alpha = 1.0;
        this.color = color;
        this.model = model;
    }

    update() {
        super.update();
        this.alpha *= this.fade_factor;
    }
}

class DynamicTextEntity extends DurationEntity {
    // Entity for dynamic text that fades

    constructor(x, y, vx, vy, ax, ay, size, hp, fade_factor, color, message) {
        super(x, y, vx, vy, ax, ay, size, 0, hp);
        this.fade_factor = fade_factor;
        this.alpha = 1.0;
        this.color = color;
        this.message = message;
    }

    update() {
        super.update();
        this.alpha *= this.fade_factor;
        this.vx *= this.fade_factor;
        this.vy *= this.fade_factor;
        this.size *= this.fade_factor;
    }
}
