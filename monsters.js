
function _make_monster_origin() {
    // Spawn monster in a ring just outside player vision
    const player = world.player;
    // 10 attempts to spawn without collision
    for (let i = 0; i < 10; i++) {
        var new_origin = normalize_vector(Math.random()-0.5, Math.random()-0.5);
        var collide = false;
        new_origin.x = new_origin.x * 1000 + player.origin.x;
        new_origin.y = new_origin.y * 1000 + player.origin.y;
        for (let j = 0; j < world.monsters.length; j++) {
            const monster = world.monsters[j];
            if (is_stuck(new_origin, 100, monster.origin, monster.size)) {
                collide = true;
                break;
            }
        }
        if (!collide) {
            break;
        }
    }
    return new_origin;
}

function _make_honzeek() {
    return {
        'eid' : global_eid++,
        'type' : 'honzeek',
        'origin' : _make_monster_origin(),
        'velocity' : {'x' : 0, 'y' : 0},
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
        'xp' : 200,
    }
}

function _make_marty() {
    return {
        'eid' : global_eid++,
        'type' : 'marty',
        'origin' : _make_monster_origin(),
        'velocity' : {'x' : 0, 'y' : 0},
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
        'xp' : 500,
    }
}

function _make_myreg() {
    return {
        'eid' : global_eid++,
        'type' : 'myreg',
        'origin' : _make_monster_origin(),
        'velocity' : {'x' : 0, 'y' : 0},
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
        'xp' : 2500,
    }
}