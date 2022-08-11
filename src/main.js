

function generate_monster_event() {
 
    // TODO: event logic that dispatches based on current game time
    if (frame < 600) {
        new HonzeekMonsterEntity();
        make_event(frame + 30, generate_monster_event, []);
    }
    else if (frame < 6000) {
        new MyregMonsterEntity();
        make_event(frame + 30, generate_monster_event, []);
    }

}

function make_event(time, callback, params) {
    var ev = {'f' : callback, 'params' : params};
    if (events[time] == undefined) {
        events[time] = [ev];
    }
    else {
        events[time].push(ev);
    }
}

function check_event() {
    // Check if something should happen at current frame
    var current_events = events[frame];
    if (current_events != undefined) {
        // Process the queue
        while (current_events.length != 0) {
            var ev = current_events.shift();
            ev.f(...ev.params);
        }
        delete events[frame];
    }
}

function prethink() {
    
}

function postthink() {
    // Check if player died this frame
    if (world.player.hp <= 0) {
        gg = true;
        world.player.hp = 0;
    }

    // Remove dead sprites
    world.sprites = world.sprites.filter(function(ent) {
        return ent.hp > 0;
    });

    // Remove dead projectiles
    world.projectiles = world.projectiles.filter(function(ent) {
        return ent.hp > 0;
    });

    // Remove dead monsters
    world.monsters = world.monsters.filter(function(ent) {
        return ent.hp > 0;
    });

    // Remove dead text messages
    world.texts = world.texts.filter(function(ent) {
        return ent.hp > 0;
    });

    // Remove all dead entities
    world.entities = world.entities.filter(function(ent) {
        if (ent.hp != undefined) {
            return ent.hp > 0;
        }
        return true;  
    });
}


// Main game loop
function simloop() {

    prehandle_controls();

    if (!paused) {
        frame += 1;
        check_event();
        world.update();
        postthink(); // Entity cleaning
    }

    if (gg) {
        // Something triggered game over this frame
        // next draw will be final and game loop stops
        clearInterval(render_interval);
    }

    draw();
}