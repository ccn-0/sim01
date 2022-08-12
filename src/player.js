class PlayerEntity extends PhysicalEntity {

    static model_idle = _load_image_asset("https://cdn.discordapp.com/emojis/980168035082055690.webp");
    static model_hit = _load_image_asset("https://cdn.discordapp.com/emojis/980168035082055690.webp");

    // Base player stats, used for init and as a calculation base for player power modifiers
    static base_size = 60;
    static base_level = 1;
    static base_max_hp = 100;
    static base_speed = 3;
    static base_defense = 0.0;
    static base_block = 0.0;
    static base_xp_multiplier = 1.0;
    static base_dash_speed = 120;
    static base_dash_duration = 10;
    static base_dash_velocity = 10;
    static base_projectile_count = 1;
    static base_projectile_spread = 0.3;
    static base_projectile_speed = 10;
    static base_projectile_pierce = 0;
    static base_projectile_chain = 0;
    static base_attack_speed = 20;
    static base_damage_min = 50;
    static base_damage_max = 100;
    static base_damage_multiplier = 1.0;
    static base_critical_chance = 0.0;

    constructor() {
        super(0, 0, 0, 0, 0, 0, PlayerEntity.base_size, true);

        this.crosshair = undefined;

        this.animation_state = 0;
        this.model = undefined;
        this.model_idle = PlayerEntity.model_idle;
        this.model_hit = PlayerEntity.model_hit;

        // Player stats
        this.level = PlayerEntity.base_level;
        this.speed = PlayerEntity.base_speed;
        this.defense = PlayerEntity.base_defense;
        this.block = PlayerEntity.base_block;
        this.max_hp = PlayerEntity.base_max_hp;
        this.hp = PlayerEntity.base_max_hp;
        this.xp_multiplier = PlayerEntity.base_xp_multiplier;
        this.xp = 0;
        this.xp_next = 1000;
        
        this.dash_speed = PlayerEntity.base_dash_speed;
        this.dash_duration = PlayerEntity.base_dash_duration;
        this.dash_velocity = PlayerEntity.base_dash_velocity;
        this.dash_cooldown = 0;
        this.dash_active = false;

        this.projectile_count = PlayerEntity.base_projectile_count;
        this.projectile_spread = PlayerEntity.base_projectile_spread;
        this.projectile_speed = PlayerEntity.base_projectile_speed;
        this.projectile_pierce = PlayerEntity.base_projectile_pierce;
        this.projectile_chain = PlayerEntity.base_projectile_chain;
        this.attack_speed = PlayerEntity.base_attack_speed;
        this.attack_cooldown = 0;
        this.damage_min = PlayerEntity.base_damage_min;
        this.damage_max = PlayerEntity.base_damage_max;
        this.damage_multiplier = PlayerEntity.base_damage_multiplier;
        this.critical_chance = PlayerEntity.base_critical_chance;

        // Player inventory of all modifiers
        this.modifiers = [];

        world.player = this;
    }

    update() {

        super.update();

        var view_vec = normalize_vector(
            keys.mouse_x - ctx.canvas.width / 2,
            keys.mouse_y - ctx.canvas.height / 2
        );
        this.ax = view_vec.x;
        this.ay = view_vec.y;
    
        var move_vec = normalize_vector(
            keys.right - keys.left,
            keys.down - keys.up
        );

        this.x += move_vec.x * this.speed;
        this.y += move_vec.y * this.speed;

        this.x = clamp(this.x, world.min_x+this.size/2, world.max_x-this.size/2);
        this.y = clamp(this.y, world.min_y+this.size/2, world.max_y-this.size/2);
    
        if (keys.space && this.dash_cooldown == 0) {
            this.__perform_dash();
        }
    
        if (keys.mouse1 && this.attack_cooldown == 0) {
            this.__perform_attack();
        }
    
        this.attack_cooldown = this.attack_cooldown <= 0 ? 0 : this.attack_cooldown-1;
        this.dash_cooldown = this.dash_cooldown <= 0 ? 0 : this.dash_cooldown-1;
    
        this.model = this.model_idle;
    
        if (this.xp >= this.xp_next) {
            this.xp = this.xp - this.xp_next; 
            this.xp_next = 2**this.level * 1000;
            this.level += 1;
            // Pause the game and enable merchant
            world.merchant.enable();
        }
    }

    __perform_attack() {
        // TODO: rewrite as event
        this.attack_cooldown = this.attack_speed;
        for (var i = 0; i < this.projectile_count; i++) {
            new ProjectileEntity(this);     
        }
    }
    
    __perform_dash() {
        // Plan dash start and end events
        var velocity = scale_vector(this.ax, this.ay, this.dash_velocity);
        
        var dash_frame = frame + 1;
        make_event(
            dash_frame, 
            () => {
                this.dash_cooldown = this.dash_speed;
                this.dash_active = true;
                this.vx += velocity.x;
                this.vy += velocity.y;
            },
            []
        );
        make_event(
            dash_frame + this.dash_duration, 
            () => {
                this.dash_active = false;
                this.vx -= velocity.x;
                this.vy -= velocity.y;
            },
            []
        );
    }
}