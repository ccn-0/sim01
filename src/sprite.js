class DynamicSpriteEntity extends DurationEntity {
    // Entity for dynamic sprite that fades

    static alpha_min = 0.1;

    constructor(x, y, vx, vy, ax, ay, size, hp, fade_factor, color, model) {
        super(x, y, vx, vy, ax, ay, size, hp);
        this.fade_factor = fade_factor;
        this.alpha = 1.0;
        this.color = color;
        this.model = model;
        world.sprites.push(this);
    }

    update() {
        super.update();
        this.alpha *= this.fade_factor;
    }
}

class DynamicTextEntity extends DurationEntity {
    // Entity for dynamic text that fades

    constructor(x, y, vx, vy, ax, ay, size, hp, fade_factor, color, message) {
        super(x, y, vx, vy, ax, ay, size, hp);
        this.fade_factor = fade_factor;
        this.alpha = 1.0;
        this.color = color;
        this.message = message;
        world.texts.push(this);
    }

    update() {
        super.update();
        this.alpha *= this.fade_factor;
        this.vx *= this.fade_factor;
        this.vy *= this.fade_factor;
        this.size *= this.fade_factor;
    }
}


// function _make_text(x, y, vx, vy, message, size, hp, fade_factor, color) {
//     // Entity for floating texts etc.
//     return {
//         'eid' : global_eid++,
//         'x' : x,
//         'y' : y,
//         'vx' : vx,
//         'vy' : vy,
//         'color' : color,
//         'alpha' : 1.0,
//         'size' : size,
//         'message' : message,
//         'hp' : hp,
//         'fade_factor' : fade_factor,
//     }
// }

// function _make_sprite(x, y, model, size, hp, fade_factor) {
//     
//     return {
//         'eid' : global_eid++,
//         'x' : x,
//         'y' : y,
//         'color' : "#000000",
//         'model' : model,
//         'size' : size,
//         'alpha' : 1.0,
//         'hp' : hp,
//         'fade_factor' : fade_factor,
//     }
// }