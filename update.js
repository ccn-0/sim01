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

function update_projectiles() {
    world.projectiles.forEach( (projectile) => {
        projectile.hp -= 1;
        projectile.origin.x += projectile.velocity.x;
        projectile.origin.y += projectile.velocity.y;
    })
}

function update_monsters() {
    var player = world.player;
    world.monsters.forEach( (monster) => {
        // Animation state
        var anim_offset = monster.frame_alive % 64;
        var next_animation_state = anim_transitions.offsets[monster.type][anim_offset];
        if (next_animation_state != undefined){
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

        // Follow player
        var dx = monster.origin.x - player.origin.x;
        var dy = monster.origin.y - player.origin.y;
        var dist = Math.sqrt(dx**2 + dy**2);
        dx /= dist;
        dy /= dist;
        monster.origin.x += -dx*monster.speed;
        monster.origin.y += -dy*monster.speed;
        monster.frame_alive += 1
    })
}

function update_camera() {
    // Just snap it to player origin
    var camera = world.camera;
    var player = world.player;
    camera.origin.x = player.origin.x;
    camera.origin.y = player.origin.y;
}

function perform_attack(count) {
    var player = world.player;
    var damage_min = player.damage_min * player.damage_percent;
    var damage_max = player.damage_max * player.damage_percent;
    player.attack_cooldown = player.attack_speed;
    // Generate projectiles
    for (var i = 0; i < count; i++) {
        var _proj = _make_projectile(player.projectile_spread, player.projectile_speed, damage_min, damage_max);
        world.entities.push(_proj);
        world.projectiles.push(_proj);
    }    
}


function update_player() {
    // Update player state using current controls
    var player = world.player;
    var crosshair = player.crosshair;
    var mouse_dx = keys.mouse_x - ctx.canvas.width/2;
    var mouse_dy = keys.mouse_y - ctx.canvas.height/2;
    var mouse_dist = Math.sqrt(mouse_dx*mouse_dx + mouse_dy*mouse_dy);
    player.angle.x = mouse_dx/mouse_dist;
    player.angle.y = mouse_dy/mouse_dist;
    player.origin.y += -player.movement_speed*keys.up;
    player.origin.y += player.movement_speed*keys.down;
    player.origin.x += -player.movement_speed*keys.left;
    player.origin.x += player.movement_speed*keys.right;
    if (keys.mouse1 && player.attack_cooldown == 0) {
        perform_attack(player.projectile_count);
    }
    player.attack_cooldown = player.attack_cooldown <= 0 ? 0 : player.attack_cooldown-1;
    player.model = player.model_idle;
    crosshair.origin.x = player.origin.x + player.angle.x * 32;
    crosshair.origin.y = player.origin.y + player.angle.y * 32;

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

function collisions() {
    var player = world.player;

    // Projectile vs monster collision
    for (var i = 0; i < world.monsters.length; i++) {
        var total_dmg = 0;
        var monster_x = world.monsters[i].origin.x;
        var monster_y = world.monsters[i].origin.y;
        var monster_size = world.monsters[i].size * 0.4; // Hitbox a bit smaller
        // Monster can be hit by multiple projs per frame
        for (var j = 0; j < world.projectiles.length; j++) {    
            var proj_x = world.projectiles[j].origin.x;
            var proj_y = world.projectiles[j].origin.y;
            var proj_size = world.projectiles[j].size;
            var dist = Math.sqrt((monster_x-proj_x)**2 + (monster_y-proj_y)**2);
            // Collision?
            if (dist < monster_size + proj_size) {
                // Kill projectile and damage monster
                world.projectiles[j].hp = 0;
                world.monsters[i].hp -= world.projectiles[j].damage;
                world.monsters[i].hit_recently = 4;
                total_dmg += world.projectiles[j].damage;

            }
        }
        if (total_dmg > 0) {
            // Make floating damage text of total damage to this monster
            var text = _make_text(monster_x+30, monster_y, 0, -2, total_dmg, 100, 60, 0.96, "#FFFFFF");
            world.texts.push(text);
            world.entities.push(text);
        }
        if (world.monsters[i].hp <= 0) {
            // Monster died after this frame of collisions
            player.xp += world.monsters[i].xp;
            var text = _make_text(monster_x-30, monster_y, 0, -2, world.monsters[i].xp + " xp", 60, 60, 0.99, "#CCCC00");
            world.texts.push(text);
            world.entities.push(text);
        }
    }

    // Player vs monster collision
    for (var i = 0; i < world.monsters.length; i++) {
        var monster = world.monsters[i];
        var monster_x = monster.origin.x;
        var monster_y = monster.origin.y;
        var player_x = player.origin.x;
        var player_y = player.origin.y;
        var dist = Math.sqrt((player_x-monster_x)**2 + (player_y-monster_y)**2);
        if (dist < player.size + monster.size * 0.4) {
            // Monster explodes and deals damage to player
            player.hp -= world.monsters[i].damage;
            world.monsters[i].hp = 0;
            var text = _make_text(player.origin.x, player.origin.y, 0, -2, world.monsters[i].damage, 100, 60, 0.96, "#FF0000");
            world.texts.push(text);
            world.entities.push(text);
            var explosion = _make_sprite(monster_x, monster_y, assets.other.bloodsplosion, monster.size*4, 20, 0.90);
            world.sprites.push(explosion);
            world.entities.push(explosion);
        }
    }
}