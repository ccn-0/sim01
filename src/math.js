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
    return (dist < (a_size + b_size) * 0.5);
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
