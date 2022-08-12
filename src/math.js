function scale_vector(x, y, s) {
    return {'x' : x*s, 'y': y*s};
}

function normalize_vector(x, y) {
    // To unit vector
    var dist = Math.hypot(x, y);
    dist = dist < 0.001 ? 0.001 : dist;
    var ux = x / dist;
    var uy = y / dist;
    return {'x' : ux, 'y': uy};
}

function rotate_vector(x, y, radians) {
    var rx = Math.cos(radians) * x - Math.sin(radians) * y;
    var ry = Math.sin(radians) * x + Math.cos(radians) * y;
    return {'x' : rx, 'y' : ry};
}

function is_stuck(ax, ay, a_size, bx, by, b_size) {
    const dist = Math.hypot(ax - bx, ay - by);
    const collided = dist < (a_size + b_size) * 0.5;
    return collided;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

Array.prototype.fast_delete = (elem) => {
    const index = this.indexOf(elem)
    this[index] = this[this.length - 1];
    this.pop();
}

function weighted_random(modifiers, count) {
    var offers = [];
    for (var n = 0; n < count; n++) {
        // Pick weighted random
        var random_mod = {};

        var weights = [];
        var items = [];
        for (var i = 0; i < modifiers.length; i++) {
            items.push(modifiers[i][1]);
            weights.push(modifiers[i][0]);
        }
        var i;
        for (i = 0; i < weights.length; i++)
            weights[i] += weights[i - 1] || 0;
        var random = Math.random() * weights[weights.length - 1];
        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;
        random_mod.item = items[i];
        random_mod.i = i;         
        offers.push(random_mod.item);
        // Remove for next round 
        modifiers.splice(random_mod.i, 1);
    }
    return offers;
}