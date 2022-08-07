
    function generate_monster_event() {
        // Generate monster
        var monster;
        
        // TODO: event logic that dispatches based on current game time
        if (frame < 3000) {
            monster = _make_honzeek();
            world.entities.push(monster);
            world.monsters.push(monster);
            make_event(frame + 40, generate_monster_event, []);
        }
        else if (frame < 6000){
            monster = _make_marty();
            world.entities.push(monster);
            world.monsters.push(monster);
            make_event(frame + 40, generate_monster_event, []);
        }
        else if (frame < 9000){
            monster = _make_myreg();
            world.entities.push(monster);
            world.monsters.push(monster);
            make_event(frame + 80, generate_monster_event, []);
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
            // Call all events
            for (var i = current_events.length - 1; i >= 0; i--) {

                current_events[i].f(...current_events[i].params);
            }
            delete events[frame];
        }
    }

    function prethink() {
        update_player();
        update_camera();
        update_monsters();
        update_projectiles();
        update_world_texts();
        update_sprites();
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
            prethink();
            collisions();
            postthink(); // Entity cleaning
        }

        if (gg) {
            // Something triggered game over this frame
            // next draw will be final and game loop stops
            clearInterval(render_interval);
        }

        draw();
         
    }