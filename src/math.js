function scale_vector(x, y, s) {
    return {'x' : x*s, 'y': y*s};
}

function normalize_vector(x, y) {
    // To unit vector
    var dist = Math.hypot(x, y);
    if (dist == 0)
        return {'x' : 0, 'y': 0};
    else 
        return {'x' : x / dist, 'y':  y / dist};
 
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

function random_in_range(min, max) {
    return Math.random() * (max - min) + min;
}

function weighted_random(modifiers, count) {
    // From array of modifiers randomly select `count` of items without duplicites
    // Returns array of indexes to modifiers array
    var offers = [];
    var weights = [];
    var items = [];
    for (var i = 0; i < modifiers.length; i++) {
        items.push(i);
        weights.push(modifiers[i].weight);
    }
    for (var n = 0; n < count; n++) {
        var i;
        for (i = 0; i < weights.length; i++)
            weights[i] += weights[i - 1] || 0;
        var random = Math.random() * weights[weights.length - 1];
        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;    
        // Select item and remove from available for next round   
        offers.push(items[i]);
        items.splice(i, 1);
        weights.splice(i, 1);
    }
    return offers;
}