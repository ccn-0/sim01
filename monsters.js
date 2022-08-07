function _make_monster_origin() {
    // Spawn monster in a ring just outside player vision
    var player = world.player;
    var x_off = Math.random()-0.5;
    var y_off = Math.random()-0.5;
    var dist = Math.sqrt(x_off**2 + y_off**2);
    x_off = x_off / dist;
    y_off = y_off / dist;
    var x = player.origin.x + 1000*x_off;
    var y = player.origin.y + 1000*y_off;
    return {'x' : x, 'y' : y};
}

function _make_honzeek() {
    return {
        'type' : 'honzeek',
        'origin' : _make_monster_origin(),
        'color' : "#999999",
        'size' : 60,
        'model' : undefined,
        'animation_state' : 0,
        'frame_alive' : 0,
        'hit_recently' : 0,
        'max_hp' : 80,
        'hp' : 80,
        'damage' : 10,
        'speed' : 3,
        'xp' : 100,
    }
}

function _make_marty() {
    return {
        'type' : 'marty',
        'origin' : _make_monster_origin(),
        'color' : "#999999",
        'size' : 60,
        'model' : undefined,
        'animation_state' : 0,
        'frame_alive' : 0,
        'hit_recently' : 0,
        'max_hp' : 120,
        'hp' : 120,
        'damage' : 30,
        'speed' : 2,
        'xp' : 150,
    }
}

function _make_myreg() {
    return {
        'type' : 'myreg',
        'origin' : _make_monster_origin(),
        'color' : "#999999",
        'size' : 60,
        'model' : undefined,
        'animation_state' : 0,
        'frame_alive' : 0,
        'hit_recently' : 0,
        'max_hp' : 200,
        'hp' : 300,
        'damage' : 30,
        'speed' : 4,
        'xp' : 400,
    }
}