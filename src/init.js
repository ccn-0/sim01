

function init_game() {
    c = document.getElementById('area');
    ctx = c.getContext('2d');
    ctx.canvas.width  = window.innerWidth-4;
    ctx.canvas.height = window.innerHeight-4;
    
    assets = load_assets();
    keys = init_control();
    add_listeners();

    world = new World(2048, 2048);
    var player = new PlayerEntity();
    var crosshair = new CrosshairEntity(player);
    player.crosshair = crosshair;
    new CameraEntity(player);
     
    // First spawn event
    make_event(100, generate_monster_event, []);

    render_interval = window.setInterval(simloop, 1000/fps);
}