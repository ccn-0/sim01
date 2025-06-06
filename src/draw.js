function draw_background() {
    // This thing is super hacky and shitty
    var camera = world.camera;
    var off_x = camera.x-ctx.canvas.width/2;
    var start_x = off_x - off_x%128;
    var end_x = start_x + ctx.canvas.width;
    var off_y = camera.y-ctx.canvas.height/2;
    var start_y = off_y - off_y%128;
    var end_y = start_y + ctx.canvas.height;
    for (var i = start_x - 128; i <= end_x + 128; i += 128) {
        for (var j = start_y - 128; j <= end_y + 128; j += 128) {
            const chunk_x = i / 128 + Map.width/2;
            const chunk_y = j / 128 + Map.height/2;
            var tile_to_draw = Map.map_to_asset[world.map.data[chunk_y][chunk_x]];
            tile_to_draw = tile_to_draw ? tile_to_draw : Map.map_to_asset[0]; // default asset if undefined
            ctx.drawImage(tile_to_draw, 
                ctx.canvas.width/2  - camera.x + i, 
                ctx.canvas.height/2 - camera.y + j,
                129, 129 // 129 because 128 looked bad
            );
        }
    }
}

function draw_hud_time() {
    var seconds = String(Math.floor((frame/60) % 60)).padStart(2, '0');
    var minutes = String(Math.floor((frame/3600) % 60)).padStart(2, '0');
    ctx.font = '24px helvetica';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(minutes + ":" + seconds, 
        ctx.canvas.width/2 - 30, 60
    );
}

function draw_hud_xp() {
    var player = world.player;
    // Draw player  level
    ctx.font = '24px helvetica';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Level " + player.level, 
        30, ctx.canvas.height - 30
    );
    // Draw player XP bar background
    ctx.fillStyle = "#888888";
    ctx.fillRect(140, ctx.canvas.height - 50, 
        ctx.canvas.width-200, 25
    );
    // Draw player XP bar
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(140, ctx.canvas.height - 50, 
        (ctx.canvas.width-200) * (player.xp/player.xp_next), 25
    );
    // Draw kill counter
    ctx.font = '24px helvetica';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Kills: " + player.kill_count, 
        ctx.canvas.width - 180, 60
    );
}

function draw_altar() {
    var altar = world.altar;
    if (altar.active) {
        ctx.drawImage(SacrificeAltar.overlay, 
            ctx.canvas.width/2  - altar.width/2, 
            ctx.canvas.height/2 - altar.height/2,
            altar.width, altar.height
        );
        ctx.font = '32px helvetica';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("The Altar of sacrifice", 
            ctx.canvas.width/2+65,  ctx.canvas.height/2-120,
        );
        ctx.fillText("...demands your choice", 
            ctx.canvas.width/2+25,  ctx.canvas.height/2-80,
        );
        // Draw offer texts
        const height_offsets = 140;
        for (let offer_index = 0; offer_index < altar.offers.length; offer_index++) {
            const offer = altar.offers[offer_index];
            const offer_offset = height_offsets * offer_index;
            ctx.font = '16px helvetica';
            ctx.fillStyle = "#FFDDEE";
            // Mod name
            ctx.fillText(offer.mod_ref.name,
                ctx.canvas.width/2-20,
                ctx.canvas.height/2-30 + offer_offset,
            );
            ctx.fillStyle = "#FFFFFF";
            // "Button"
            ctx.fillText("[" + (offer_index+1) + "]", 
                ctx.canvas.width/2-20,  
                ctx.canvas.height/2 + offer_offset,
            );  
            // Descriptions
            for (let desc_index = 0; desc_index < offer.desc.length; desc_index++) {
                const desc = offer.desc[desc_index];
                ctx.fillText(desc, 
                    ctx.canvas.width/2+10,  
                    ctx.canvas.height/2 + offer_offset + desc_index*30
                );
            }   
        }
    }
}

function draw_merchant() {
    var merchant = world.merchant;
    if (merchant.active) {
        // Draw merchant screen
        ctx.drawImage(Merchant.overlay, 
            ctx.canvas.width/2  - merchant.width/2, 
            ctx.canvas.height/2 - merchant.height/2,
            merchant.width, merchant.height
        );
        ctx.font = '40px helvetica';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Level Up! Free Offer!", 
            ctx.canvas.width/2-100,  ctx.canvas.height/2-210,
        );
        // Draw offer texts
        const height_offsets = 140;
        for (let offer_index = 0; offer_index < merchant.offers.length; offer_index++) {
            const offer = merchant.offers[offer_index]
            const offer_offset = height_offsets * offer_index;
            ctx.font = '16px helvetica';
            ctx.fillStyle = "#FFFFFF";
            // "Button"
            ctx.fillText("[" + (offer_index+1) + "]", 
                ctx.canvas.width/2-85,  
                ctx.canvas.height/2-140 + offer_offset,
            );  
            // Descriptions
            for (let desc_index = 0; desc_index < offer.desc.length; desc_index++) {
                const desc = offer.desc[desc_index];
                ctx.fillText(desc, 
                    ctx.canvas.width/2-55,  
                    ctx.canvas.height/2-140 + offer_offset + desc_index*30
                );
            }
            // Tier
            ctx.fillStyle = StatModifier.tier_desc[merchant.offers[offer_index].tier_id].color;
            ctx.fillText(StatModifier.tier_desc[merchant.offers[offer_index].tier_id].desc, 
                ctx.canvas.width/2+280,  
                ctx.canvas.height/2-140 + offer_offset,
            );        
        }

    }
}

function draw_paused_screen(color) {
    ctx.globalAlpha = 0.80;
    ctx.fillStyle = color;
    ctx.fillRect(
        0, 
        0, 
        ctx.canvas.width, ctx.canvas.height
    );
    ctx.globalAlpha = 1.0;
    var today = new Date();
    var date = 
             String(today.getFullYear()).padStart(4, '0')
     + '-' + String(today.getMonth()+1).padStart(2, '0')
     + '-' + String(today.getDate()).padStart(2, '0');
    var time = 
             String(today.getHours()).padStart(2, '0')
     + ":" + String(today.getMinutes()).padStart(2, '0')
     + ":" + String(today.getSeconds()).padStart(2, '0');
    var dateTime = date + ' ' + time;
    ctx.font = '18px helvetica';
    ctx.fillStyle = "#DDDDDD";
    ctx.fillText(dateTime, 
        20,  30
    );
    ctx.fillStyle = "#DDDDDD";
    ctx.fillText("Paused", 
    ctx.canvas.width/2-28,  30
    );
}

function draw_hud_cooldown_icon(x,y,cooldown, active_icon, inactive_icon) {
    if (cooldown == 0) {
        ctx.drawImage(active_icon, 
            x, 
            y,
            64, 64
        );
    }
    else {
        ctx.drawImage(inactive_icon, 
            x, 
            y,
            64, 64
        );
        var cd_text = (cooldown/60).toFixed(1);
        ctx.font = '30px helvetica';
        ctx.fillText(cd_text, 
            x+15, 
            y+40);   
    }
}

function draw_hud_cooldowns() {
    // Dash and attack
    var player = world.player;
    draw_hud_cooldown_icon(
        ctx.canvas.width/2  - 96,
        ctx.canvas.height - 150,
        player.dash_cooldown_timer, 
        assets.hud.dash_active,
        assets.hud.dash_inactive
    )
    draw_hud_cooldown_icon(
        ctx.canvas.width/2  + 32,
        ctx.canvas.height - 150,
        player.attack_cooldown_timer, 
        assets.hud.attack_active,
        assets.hud.attack_inactive
    )
}

function draw_player_stats() {
    const offsets = 20;
    var player = world.player;
    ctx.font = '14px helvetica';
    ctx.fillStyle = "#DDDDDD";
    ctx.fillText(`Level: ${player.level}`, 20,  100 + offsets*0);
    ctx.fillText(`Damage: ${Math.round(player.damage_min/player.damage_multiplier)} to ${Math.round(player.damage_max/player.damage_multiplier)} (+${Math.round((player.damage_multiplier - 1)*100)}%)`, 20,  100 + offsets*1);
    ctx.fillText(`Critical chance: ${Math.round(player.critical_chance*100)}%`, 20,  100 + offsets*2);
    ctx.fillText(`Attack cooldown: ${(player.attack_cooldown_duration/60).toFixed(2)} seconds`, 20,  100 + offsets*3);
    ctx.fillText(`Movement speed: +${Math.round((player.speed_multiplier-1)*100)}%`, 20,  100 + offsets*4);
    ctx.fillText(`Defense: ${Math.round(player.defense*100)}%`, 20,  100 + offsets*5);
    ctx.fillText(`Block: ${Math.round(player.block_effective*100)}% (${Math.round(player.block_real*100)}%)`, 20,  100 + offsets*6);
    ctx.fillText(`HP regen: ${(player.hp_regen*60).toFixed(2)} per second`, 20,  100 + offsets*7);
    ctx.fillText(`Dash cooldown: ${(player.dash_cooldown_duration/60).toFixed(2)} seconds`, 20,  100 + offsets*8);
    ctx.fillText(`Dash speed: ${player.dash_speed}`, 20,  100 + offsets*9);
    ctx.fillText(`Projectile count: ${player.projectile_count}`, 20,  100 + offsets*10);
    ctx.fillText(`Projectile spread: ${(player.projectile_spread*57.2958).toFixed(1)} degrees`, 20,  100 + offsets*11);
    ctx.fillText(`Projectile speed: ${(player.projectile_speed*60).toFixed(1)} u/s`, 20,  100 + offsets*12);
    ctx.fillText(`Projectile pierce: ${player.projectile_pierce}`, 20,  100 + offsets*13);
    ctx.fillText(`Projectile chain: ${player.projectile_chain}`, 20,  100 + offsets*14);
}

function draw_hud_altar(x,y) {
    var altar = world.altar;
    if (altar.full) {
        ctx.font = '30px helvetica';
        ctx.fillText(`[Q]`, 
            x-40, 
            y+40);
        ctx.drawImage(SacrificeAltar.icons[1], 
            x, 
            y,
            64, 64
        );
    }
    else {
        ctx.drawImage(SacrificeAltar.icons[0], 
            x, 
            y,
            64, 64
        );
        ctx.font = '30px helvetica';
        ctx.fillText(`${altar.blood_stacks}/${altar.blood_stacks_max}`, 
            x-70, 
            y+40);
    }
}

function draw_hud() {   
    // Draw player HP
    var player = world.player;

    ctx.font = '40px helvetica';
    ctx.fillStyle = "#FF0000";
    ctx.fillText(Math.ceil(player.hp) + "/" + Math.ceil(player.max_hp), 
        30,  ctx.canvas.height - 90
    );

    draw_hud_xp();
    draw_hud_altar(ctx.canvas.width - 150, ctx.canvas.height - 150);
    draw_hud_cooldowns();
    draw_hud_time();

    // Pause game draws under here
    if (paused) {
        draw_paused_screen("#040610");
        draw_player_stats(); 
        draw_merchant(); // ONLY IF MERCHANT ACTIVATED
        draw_altar(); // ONLY IF ALTAR ACTIVATED
    }

    // Draw gg screen
    if (gg) {
        draw_paused_screen("#330000");
        draw_player_stats(); 
        // gg screen
        ctx.drawImage(assets.hud.end_screen, 
            ctx.canvas.width/2  - 256, 
            ctx.canvas.height/2  - 256,
            512, 512
        );
    }
}

function draw() {

    var camera = world.camera;

    draw_background();

    // draw_entities
    world.entities.forEach( (ent) => {
        ctx.globalAlpha = ent.alpha ? ent.alpha : 1.0;

        // Entity has a model to draw
        if (ent.model) {
            ctx.drawImage(ent.model, 
                ctx.canvas.width/2  - camera.x + ent.x-ent.size/2, 
                ctx.canvas.height/2 - camera.y + ent.y-ent.size/2,
                ent.size, ent.size
            );
        }
        // Entity has a text to draw
        else if (ent.message) {      
            ctx.font = ent.size + 'px helvetica';
            ctx.fillStyle = ent.color;
            ctx.fillText(ent.message, 
                ctx.canvas.width/2  - camera.x + ent.x, 
                ctx.canvas.height/2 - camera.y + ent.y);        
        }
        // Entity has color
        else if (ent.color) {
            ctx.fillStyle = ent.color;
            ctx.fillRect(
                ctx.canvas.width/2  - camera.x + ent.x, 
                ctx.canvas.height/2 - camera.y + ent.y, 
                ent.size, ent.size);
        }
        ctx.globalAlpha = 1.0;      
    })

    draw_hud();
}