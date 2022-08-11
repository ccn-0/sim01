


// function perform_attack() {
//     // TODO: rewrite as event
//     var player = world.player;

//     player.attack_cooldown = player.attack_speed;
//     for (var i = 0; i < player.projectile_count; i++) {
//         new ProjectileEntity(player);     
//     }    
// }

// function perform_dash(velocity) {
//     // Plan dash start and end events
//     var player = world.player;
//     var dash_frame = frame + 1;
//     make_event(
//         dash_frame, 
//         () => { 
//             player.dash_cooldown = player.dash_speed;
//             player.dash_active = true;
//             player.vx += velocity.x;
//             player.vy += velocity.y;
//         },
//         []
//     );
//     make_event(
//         dash_frame + player.dash_duration, 
//         () => {
//             player.dash_active = false;
//             player.vx -= velocity.x;
//             player.vy -= velocity.y;
//         },
//         []
//     );
// }

// function update_player() {
//     // Update player state using current controls
//     var player = world.player;
//     var crosshair = player.crosshair;

//     // Viewangle
//     var view_vec = normalize_vector(
//         keys.mouse_x - ctx.canvas.width / 2,
//         keys.mouse_y - ctx.canvas.height / 2
//     );
//     player.ax = view_vec.x;
//     player.ay = view_vec.y;

//     // Movement angle
//     var move_vec = normalize_vector(
//         keys.right - keys.left,
//         keys.down - keys.up
//     );

//     // Dash
//     if (keys.space && player.dash_cooldown == 0) {
//         perform_dash(scale_vector(view_vec.x, view_vec.y, player.dash_velocity));
//     }

//     // Attack
//     if (keys.mouse1 && player.attack_cooldown == 0) {
//         perform_attack();
//     }

//     // Tick down cooldowns
//     player.attack_cooldown = player.attack_cooldown <= 0 ? 0 : player.attack_cooldown-1;
//     player.dash_cooldown = player.dash_cooldown <= 0 ? 0 : player.dash_cooldown-1;

//     // Update origin
//     player.x += player.vx + move_vec.x * player.speed;
//     player.y += player.vy + move_vec.y * player.speed;
//     crosshair.x = player.x + player.ax * 32;
//     crosshair.y = player.y + player.ay * 32;

//     // Model/animation
//     player.model = player.model_idle;

//     // Level up 
//     if (player.xp >= player.xp_next) {
//         player.xp = player.xp - player.xp_next; 
//         player.xp_next = 2**player.level * 1000;
//         player.level += 1;
//         // Pause the game and spawn merchant
//         paused = true;
//         var merchant = _make_merchant();
//         world.merchant = merchant;
//     }
// }

// function collisions_player_monsters() {
//     var player = world.player;
//     if (player.dash_active) {
//         // Player has no collision during dash
//         return;
//     }
//     // Player vs monster collision
//     for (var i = 0; i < world.monsters.length; i++) {
//         var monster = world.monsters[i];
//         var dist = Math.hypot(player.x-monster.x, player.y-monster.y);
//         if (dist < (player.size + monster.size)*0.5) { 
//             var is_blocked = Math.random() < player.block ? 1 : 0;
//             var result_damage = Math.floor(
//                 (monster.damage / (player.defense+1))
//                 * (1-is_blocked));
//             player.hp -= result_damage;
//             monster.hp = 0;
//             var message = result_damage + (is_blocked ? "(blocked)" : "");
//             new DynamicTextEntity(player.x, player.y, 0, -2, 0, 0, 100, 60, 0.96, "#FF0000", message);
//             new DynamicSpriteEntity(monster.x, monster.y, 0, 0, 0, 0, 
//                 monster.size * 4, 15, 0.85, "#CC0000", assets.other.bloodsplosion);
//         }
//     }
// }

// function collisions() {
//     collisions_player_monsters();
// }