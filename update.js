function update_sprites() {
    world.sprites.forEach( (sprite) => {
        sprite.hp -= 1;
        sprite.alpha *= sprite.fade_factor;
        sprite.alpha = sprite.alpha < 0.1 ? 0.1 : sprite.alpha;
    });
}

function update_world_texts() {
    world.texts.forEach( (text) => {
        text.hp -= 1;
        text.origin.x += text.velocity.x;
        text.origin.y += text.velocity.y;
        text.velocity.x *= text.fade_factor;
        text.velocity.y *= text.fade_factor;
        text.size *= text.fade_factor;
        text.alpha -= 0.03;
        text.alpha = text.alpha < 0.1 ? 0.1 : text.alpha;
    });
}

function _projectile_next_target(projectile) {
    // Change velocity towards random monster
    const random_monster = world.monsters[
        Math.floor(Math.random() * world.monsters.length)
    ];
    var new_vec = normalize_vector(
        random_monster.origin.x - projectile.origin.x,
        random_monster.origin.y - projectile.origin.y,
    )
    new_vec.x *= projectile.speed;
    new_vec.y *= projectile.speed;
    return new_vec;
}

function _projectile_hit(projectile, monster) {
    var result_damage = projectile.damage * (projectile.is_crit ? 2.0 : 1.0)          
    monster.hp -= result_damage;
    monster.hit_recently = 4;  
    projectile.entities_excluded.push(monster.eid);

    if (projectile.projectile_chain > 0) {
        // Projectile changes velocity towards random monster
        // and refreshes duration
        projectile.velocity = _projectile_next_target(projectile);
        projectile.hp = 60;
        projectile.projectile_chain--;
    }
    else if (projectile.projectile_pierce > 0) {
        // Projectile no longer chains, but can still pierce
        projectile.projectile_pierce--;
    }
    else {
        // Hit was final, kill projectile
        projectile.hp = 0;
    }
    
    var text = _make_text(monster.origin.x+30, monster.origin.y, 0, -2, result_damage, 100, 60, 0.96, "#FFFFFF");
    world.texts.push(text);
    world.entities.push(text);
}

function update_projectiles() {
    var player = world.player;
    for (var i = 0; i < world.projectiles.length; i++) {
        var projectile = world.projectiles[i];
        // Check if some monster is hit
        for (var j = 0; j < world.monsters.length; j++) {
            var monster = world.monsters[j];
            var dist = Math.hypot(
                monster.origin.x - projectile.origin.x,
                monster.origin.y - projectile.origin.y
            );
            if (dist < (monster.size + projectile.size) * 0.5
                && !projectile.entities_excluded.includes(monster.eid)) {     
                // Simulate hit
                _projectile_hit(projectile, monster);
                break; // Projectile can hit at most 1 monster per frame
            }
        }
        projectile.hp -= 1;
        projectile.origin.x += projectile.velocity.x;
        projectile.origin.y += projectile.velocity.y;
    }   
}



function update_monsters() {
    var player = world.player;
    for (var i = 0; i < world.monsters.length; i++) {
        var monster = world.monsters[i];

        if (monster.hp <= 0) {
            var result_xp = monster.xp * player.xp_multiplier;
            player.xp += result_xp;
            var text = _make_text(monster.origin.x-30, monster.origin.y, 0, -2, result_xp + " xp", 60, 60, 0.99, "#CCCC00");
            world.texts.push(text);
            world.entities.push(text);
        }

        // Animation state
        var anim_offset = monster.frame_alive % 64;
        var next_animation_state = anim_transitions.offsets[monster.type][anim_offset];
        if (next_animation_state != undefined) {
            // Change animation state
            monster.animation_state = next_animation_state;
        }
        if (monster.hit_recently > 0) {
            // Hit animation model has priority
            monster.model = assets[monster.type].model_hit;
            monster.hit_recently -= 1;
        }
        else {
            // Set normal model based on current animation state
            monster.model = anim_transitions.states[monster.type][monster.animation_state];
        }

        // TODO: fix bad movement logic
        // Unit vector towards player
        var uvec = normalize_vector(
            monster.origin.x - player.origin.x, 
            monster.origin.y - player.origin.y
        )

        // Try move straight, then 45 degrees left and right,
        // then finally 90 degrees left and right. This is probably not very
        // efficient or smart, but looks good enough.
        var candidate_moves = [
            uvec,
            rotate_vector(uvec.x, uvec.y, Math.PI/4),
            rotate_vector(uvec.x, uvec.y, -Math.PI/4),
            rotate_vector(uvec.x, uvec.y, Math.PI/2),
            rotate_vector(uvec.x, uvec.y, -Math.PI/2),
        ];

        var mx = monster.origin.x;
        var my = monster.origin.y;
        
        // Try moves and accept the first position that doesnt collide
        for (var move = 0; move < candidate_moves.length; move++) {
            var move_vec = candidate_moves[move]
            var new_x = monster.origin.x - move_vec.x * monster.speed;
            var new_y = monster.origin.y - move_vec.y * monster.speed;
            var collision_flag = false;
            for (var j = 0; j < world.monsters.length; j++) {
                if (i == j) continue;
                var origin_j = world.monsters[j].origin;
                var size_j = world.monsters[j].size;
                var dist_monster = Math.sqrt((new_x-origin_j.x)**2 + (new_y-origin_j.y)**2);
                if (dist_monster < (size_j + monster.size)*0.5) {
                    collision_flag = true;
                    break;
                }
            }
            if (!collision_flag) {
                // No collision, accept new position
                mx = new_x;
                my = new_y;
                break;
            }
        }
        world.monsters[i].origin.x = mx;
        world.monsters[i].origin.y = my;
        monster.frame_alive += 1
    }
}

function update_camera() {
    // Just snap it to player origin
    var camera = world.camera;
    var player = world.player;
    camera.origin.x = player.origin.x;
    camera.origin.y = player.origin.y;
}

function perform_attack() {
    // TODO: rewrite as event
    var player = world.player;
    var damage_min = player.damage_min * player.damage_percent;
    var damage_max = player.damage_max * player.damage_percent;
    player.attack_cooldown = player.attack_speed;
    for (var i = 0; i < player.projectile_count; i++) {
        var _proj = _make_projectile(player.projectile_spread, player.projectile_speed, damage_min, damage_max);
        world.entities.push(_proj);
        world.projectiles.push(_proj);
    }    
}

function perform_dash(velocity) {
    // Plan dash start and end events
    var player = world.player;
    var dash_frame = frame + 1;
    make_event(
        dash_frame, 
        () => { 
            player.dash_cooldown = player.dash_speed;
            player.dash_active = true;
            player.velocity.x += velocity.x;
            player.velocity.y += velocity.y;
        },
        []
    );
    make_event(
        dash_frame + player.dash_duration, 
        () => {
            player.dash_active = false;
            player.velocity.x -= velocity.x;
            player.velocity.y -= velocity.y;
        },
        []
    );
}

function update_player() {
    // Update player state using current controls
    var player = world.player;
    var crosshair = player.crosshair;

    // Viewangle
    var view_vec = normalize_vector(
        keys.mouse_x - ctx.canvas.width / 2,
        keys.mouse_y - ctx.canvas.height / 2
    );
    player.angle = view_vec;

    // Movement angle
    var move_vec = normalize_vector(
        keys.right - keys.left,
        keys.down - keys.up
    );

    // Dash
    if (keys.space && player.dash_cooldown == 0) {
        perform_dash(scale_vector(view_vec.x, view_vec.y, player.dash_velocity));
    }

    // Attack
    if (keys.mouse1 && player.attack_cooldown == 0) {
        perform_attack();
    }

    // Tick down cooldowns
    player.attack_cooldown = player.attack_cooldown <= 0 ? 0 : player.attack_cooldown-1;
    player.dash_cooldown = player.dash_cooldown <= 0 ? 0 : player.dash_cooldown-1;

    // Update origin
    player.origin.x += player.velocity.x + move_vec.x * player.movement_speed;
    player.origin.y += player.velocity.y + move_vec.y * player.movement_speed;
    crosshair.origin.x = player.origin.x + player.angle.x * 32;
    crosshair.origin.y = player.origin.y + player.angle.y * 32;

    // Model/animation
    player.model = player.model_idle;

    // Level up 
    if (player.xp >= player.xp_next) {
        player.xp = player.xp - player.xp_next; 
        player.xp_next = 2**player.level * 1000;
        player.level += 1;
        // Pause the game and spawn merchant
        paused = true;
        var merchant = _make_merchant();
        world.merchant = merchant;
    }
}

function collisions_player_monsters() {
    var player = world.player;
    if (player.dash_active) {
        // Player has no collision during dash
        return;
    }
    // Player vs monster collision
    for (var i = 0; i < world.monsters.length; i++) {
        var monster = world.monsters[i];
        var monster_x = monster.origin.x;
        var monster_y = monster.origin.y;
        var player_x = player.origin.x;
        var player_y = player.origin.y;
        var dist = Math.sqrt((player_x-monster_x)**2 + (player_y-monster_y)**2);
        if (dist < (player.size + monster.size)*0.4) {
            // Monster explodes and deals damage to player   
            var is_blocked = Math.random() < player.block ? 1 : 0;
            var result_damage = Math.floor(
                (world.monsters[i].damage / (player.defense+1))
                * (1-is_blocked));
            player.hp -= result_damage;
            world.monsters[i].hp = 0;
            var message = result_damage + (is_blocked ? "(blocked)" : "");
            var text = _make_text(player.origin.x, player.origin.y, 0, -2, message, 100, 60, 0.96, "#FF0000");
            world.texts.push(text);
            world.entities.push(text);
            var explosion = _make_sprite(monster_x, monster_y, assets.other.bloodsplosion, monster.size*4, 20, 0.90);
            world.sprites.push(explosion);
            world.entities.push(explosion);
        }
    }
}



function collisions() {
    // collisions_monsters();
    //collisions_projectiles_monsters();
    collisions_player_monsters();
}