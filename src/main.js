

function generate_monster_event() {
 
    // TODO: event logic that dispatches based on current game time
    if (frame < 2000) {
        new HonzeekMonsterEntity();
        make_event(frame + 50, generate_monster_event, []);
    }
    else if (frame < 8000) {
        new MyregMonsterEntity();
        make_event(frame + 40, generate_monster_event, []);
    }
    else if (frame < 16000) {
        new MyregMonsterEntity();
        make_event(frame + 30, generate_monster_event, []);
    }
    else if (frame < 32000) {
        new MyregMonsterEntity();
        make_event(frame + 20, generate_monster_event, []);
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