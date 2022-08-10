

function _make_merchant() {
    var x = world.player.origin.x;
    var y = world.player.origin.y;
    var offers = _generate_offers();
    // Entity for merchant
    return {
        'eid' : global_eid++,
        'origin' : {'x' : x, 'y' : y},
        'sizes' : {'width' : 512, 'height' : 256},
        'color' : "#000000",
        'model' : assets.other.merchant,
        'offers' : offers,
    }
}

function _make_sprite(x, y, model, size, hp, fade_factor) {
    // Entity for additional static visual effects (no gameplay interaction)
    return {
        'eid' : global_eid++,
        'origin' : {'x' : x, 'y' : y},
        'color' : "#000000",
        'model' : model,
        'size' : size,
        'alpha' : 1.0,
        'hp' : hp,
        'fade_factor' : fade_factor,
    }
}

function _make_text(x, y, vx, vy, message, size, hp, fade_factor, color) {
    // Entity for floating texts etc.
    return {
        'eid' : global_eid++,
        'origin' : {'x' : x, 'y' : y},
        'velocity' : {'x' : vx, 'y' : vy},
        'color' : color,
        'alpha' : 1.0,
        'size' : size,
        'message' : message,
        'hp' : hp,
        'fade_factor' : fade_factor,
    }
}

function _make_projectile(spread, speed, damage_min, damage_max) {
    var player = world.player;
    var rand_angle = (Math.random() - 0.5) * spread;
    var vel_x = Math.cos(rand_angle) * player.angle.x - Math.sin(rand_angle) * player.angle.y;
    var vel_y = Math.sin(rand_angle) * player.angle.x + Math.cos(rand_angle) * player.angle.y;
    var damage = Math.floor(Math.random()*(damage_max-damage_min) + damage_min);
    var is_crit = Math.random() < player.critical_chance ? 1 : 0;
    return {
        'eid' : global_eid++,
        'type' : "projectile",
        'origin' : {"x" : player.origin.x + player.angle.x*30, "y" : player.origin.y + player.angle.y*30},
        'velocity' : {"x" : vel_x*speed, "y" : vel_y*speed},
        'speed' : speed,
        'projectile_chain' : player.projectile_chain,
        'projectile_pierce' : player.projectile_pierce,
        'entities_excluded' : [], // List of monsters projectile already hit (to prevent multiple hits in case of pierce/chain)
        'size' : 7,
        'color' : "#FFFFFF",
        'hp' : 60,
        'damage' : damage,
        'is_crit' : is_crit,
    }
}