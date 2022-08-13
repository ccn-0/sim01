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
    ctx.font = '24px serif';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(minutes + ":" + seconds, 
        ctx.canvas.width/2 - 30, 60
    );
}

function draw_hud_xp() {
    var player = world.player;
    // Draw player  level
    ctx.font = '24px serif';
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
}

function draw_merchant() {
    var merchant = world.merchant;
    if (merchant.active) {
        // Draw merchant screen and offered item tooltips
        ctx.drawImage(Merchant.overlay, 
            ctx.canvas.width/2  - merchant.width/2, 
            ctx.canvas.height/2 - merchant.height/2,
            merchant.width, merchant.height
        );
        ctx.font = '40px serif';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Level Up! Free Offer!", 
            ctx.canvas.width/2-100,  ctx.canvas.height/2-120,
            );

        // Offer 1
        ctx.font = '20px serif';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("[1]  " + merchant.offers[0], 
            ctx.canvas.width/2+10,  ctx.canvas.height/2-41,
        );

        // Offer 2
        ctx.font = '20px serif';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("[2]  " + merchant.offers[1], 
            ctx.canvas.width/2+10,  ctx.canvas.height/2+17,
        );

        // Offer 3
        ctx.font = '20px serif';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("[3]  " + merchant.offers[2], 
            ctx.canvas.width/2+10,  ctx.canvas.height/2+75,
        );
    }
}

function draw_paused_screen() {
    ctx.globalAlpha = 0.80;
    ctx.fillStyle = "#000000";
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
    ctx.font = '18px serif';
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
        ctx.font = '30px serif';
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

function draw_hud() {   
    // Draw player HP
    var player = world.player;

    ctx.font = '40px serif';
    ctx.fillStyle = "#FF0000";
    ctx.fillText(player.hp + "/" + player.max_hp, 
        30,  ctx.canvas.height - 90
    );

    draw_hud_xp();

    draw_hud_cooldowns();

    draw_hud_time();

    // Pause game draws under here
    if (paused) {
        draw_paused_screen();
        draw_merchant();
    }

    // Draw gg screen
    if (gg) {
        ctx.globalAlpha = 0.80;
        ctx.fillStyle = "#440000";
        ctx.fillRect(
            0, 
            0, 
            ctx.canvas.width, ctx.canvas.height
        );
        ctx.globalAlpha = 1.0;

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
            ctx.font = ent.size + 'px serif';
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