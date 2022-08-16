

function generate_monster_event(wave_num) {
 
    if (frame < 3600*wave_num) {
        if (wave_num % 2) {
            new HonzeekMonsterEntity(wave_num*15, wave_num*1, wave_num*0.03, 0); // Extra hp, extra damage, extra speed
        }
        else {
            new MyregMonsterEntity(wave_num*30, wave_num*2, 0, 0); // Extra hp, extra damage, extra speed
        }
        make_event(Math.floor(frame + (120 / Math.sqrt(wave_num))), generate_monster_event, [wave_num]);
    }

}

function generate_raremonster_event(wave_num) {
 
    new NykMonsterEntity(wave_num*20, wave_num*1, wave_num*0.05, wave_num*200); // Extra hp, extra damage, extra speed, extra xp

}

function generate_wave_event(wave_num) {
    new DynamicTextEntity(
        world.player.x, world.player.y-80,
        0, 0, 0, 0, 50, 180, 0.98, "#FFCC77", `Wave ${wave_num}`
    );
    make_event(frame, generate_monster_event, [wave_num]); // First monster of the wave
    make_event(frame + 1000, generate_raremonster_event, [wave_num]); // Rares
    make_event(frame + 1200, generate_raremonster_event, [wave_num]); // Rares
    make_event(frame + 1400, generate_raremonster_event, [wave_num]); // Rares
    make_event(frame + 1600, generate_raremonster_event, [wave_num]); // Rares
    make_event(frame + 1800, generate_raremonster_event, [wave_num]); // Rares
    make_event(frame + 2000, generate_raremonster_event, [wave_num]); // Rares
    make_event(frame + 3600, generate_wave_event, [wave_num+1]); // Plan next wave in a minute
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


// Main game loop
function simloop() {

    prehandle_controls();

    if (!paused) {
        frame += 1;
        check_event();
        world.update();
    }

    if (gg) {
        // Something triggered game over this frame
        // next draw will be final and game loop stops
        clearInterval(render_interval);
    }

    draw();
}