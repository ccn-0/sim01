function _make_crosshair() {
    return {
        'eid' : global_eid++,
        'origin' : {'x' : 0, 'y' : 0},
        'color' : "#FF0000",
        'size' : 4
    }
}

function _make_player() {
    var crosshair = _make_crosshair();
    return {
        'eid' : global_eid++,
        'origin' : {'x' : 0, 'y' : 0},
        'velocity' : {'x' : 0, 'y' : 0},
        'angle' : {'x' : 1, 'y' : 0},
        'crosshair' : crosshair,
        'model_idle' : assets.player.model_idle,
        'model_hit' : assets.player.model_hit,
        'movement_speed' : 4,
        'color' : "#008800",
        'size' : 60,
        'defense' : 0.0,
        'block' : 0.0,
        'damage_min' : 30,
        'damage_max' : 60,
        'damage_percent' : 1.0,
        'critical_chance' : 0.0,
        'attack_speed' : 20,  // Attack can happen every X frames
        'attack_cooldown' : 0,
        'dash_speed' : 60,   // Dash can happen every X frames
        'dash_cooldown' : 0,
        'dash_duration' : 12,  // How many frames is dash active
        'dash_velocity' : 20,
        'dash_active' : false,
        'projectile_count' : 1,
        'projectile_spread' : 0.3,
        'projectile_speed' : 10,
        'projectile_pierce' : 0,
        'projectile_chain' : 0,
        'xp_multiplier' : 5.0,
        'leech' : 0,
        'max_hp' : 100,
        'hp' : 100,
        'xp' : 0,
        'xp_next' : 1000,
        'level' : 1,
        'modifiers' : [],
    }
}

function make_world() {
    var player = _make_player();
    var camera = _make_crosshair();
    var world = {
        'eid' : global_eid++,
        'mapsize' : {'x' : 500, 'y' : 500},
        'player' : player,
        'camera' : camera,
        'merchant' : undefined,
        'entities' : [player, player.crosshair],
        'monsters' : [],
        'projectiles' : [],
        'texts' : [],
        'sprites' : [],
    };
    return world;
}

function _make_camera() {
    return {
        'eid' : global_eid++,
        'origin' : {'x' : 0, 'y' : 0},
    }
}

function init_game() {
    c = document.getElementById('area');
    ctx = c.getContext('2d');
    ctx.canvas.width  = window.innerWidth-4;
    ctx.canvas.height = window.innerHeight-4;
    fps = 60;
    
    assets = load_assets();
    anim_transitions = load_anim_transitions();
    world = make_world();
    keys = init_control();
    
    // First spawn event
    make_event(100, generate_monster_event, []);

    add_listeners();

    render_interval = window.setInterval(simloop, 1000/fps);
}