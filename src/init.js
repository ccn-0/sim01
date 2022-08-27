

function init_game() {
    document.documentElement.style.overflow = 'hidden';
    c = document.getElementById('area');
    ctx = c.getContext('2d');
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    window.onresize = () => {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }
    
    assets = load_assets();
    keys = init_control();
    add_listeners();

    world = new World(2048, 2048);
    new HitObserver(world);
    new MonsterDespawnObserver(world);
    new MonsterKnockbackOndeathObserver(world);
    new ItemPickupObserver(world);
    var player = new PlayerEntity();
    var crosshair = new CrosshairEntity(player);
    player.crosshair = crosshair;
    new CameraEntity(player);
     
    // Start game events
    var wave = 1;
    make_event(10, generate_wave_event, [wave]);
    make_event(2, () => {
        new DynamicSpriteEntity(0, -200, 0, 0, 0, 0, 
        320, 360, 0.992, "#FFFFFF", assets.other.game_controls);
    }, 
    [])

    render_interval = window.setInterval(simloop, 1000/fps);
}