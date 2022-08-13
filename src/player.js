class PlayerEntity extends PhysicalEntity {

    static model_idle = _load_image_asset("https://cdn.discordapp.com/emojis/980168035082055690.webp");
    static model_hit = _load_image_asset("https://cdn.discordapp.com/emojis/980168035082055690.webp");

    // Base player stats, used for init and as a calculation base for player power modifiers
    static base_size = 60;
    static base_level = 1;
    static base_max_hp = 100;
    static base_max_hp_multiplier = 1.0;
    static base_speed = 3;
    static base_defense = 0.0;
    static base_block = 0.0;
    static base_xp_multiplier = 1.0;
    static base_dash_speed = 20;
    static base_dash_active_duration = 8;
    static base_dash_cooldown_duration = 300;
    static base_projectile_count = 1;
    static base_projectile_spread = 0.3;
    static base_projectile_speed = 10;
    static base_projectile_pierce = 0;
    static base_projectile_chain = 0;
    static base_attack_cooldown_duration = 60;
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
        this.defense = PlayerEntity.base_defense;           // result_dmg = incoming_damage / (defense + 1)
        this.block_real = PlayerEntity.base_block;          // chance to block total uncapped
        this.block_effective = PlayerEntity.base_block;     // chance to block capped at 90%
        this.max_hp = PlayerEntity.base_max_hp;
        this.max_hp_multiplier = PlayerEntity.base_max_hp_multiplier;
        this.max_hp = this.max_hp*this.max_hp_multiplier;
        this.hp = this.max_hp;
        this.xp_multiplier = PlayerEntity.base_xp_multiplier;
        this.xp = 0;
        this.xp_next = 1000;
        
        // Dash state
        this.dash_cooldown_duration = PlayerEntity.base_dash_cooldown_duration;
        this.dash_speed = PlayerEntity.base_dash_speed;
        this.dash_active_duration = PlayerEntity.base_dash_active_duration;

        this.dash_cooldown_timer = 0;
        this.dash_active_timer = 0;
        this.dash_isactive = false;
        

        // Attack state
        this.attack_cooldown_duration = PlayerEntity.base_attack_cooldown_duration;
        this.attack_cooldown_timer = 0;
        this.projectile_count = PlayerEntity.base_projectile_count;
        this.projectile_spread = PlayerEntity.base_projectile_spread;
        this.projectile_speed = PlayerEntity.base_projectile_speed;
        this.projectile_pierce = PlayerEntity.base_projectile_pierce;
        this.projectile_chain = PlayerEntity.base_projectile_chain;

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

        this.__update_dash();
        this.__update_attack();
    
        this.model = this.model_idle;
    
        if (this.xp >= this.xp_next) {
            this.xp = this.xp - this.xp_next; 
            this.xp_next = 2**this.level * 1000;
            this.level += 1;
            // Pause the game and enable merchant
            world.merchant.enable();
        }
    }

    recalc_stats() {
        this.max_hp = PlayerEntity.base_max_hp;
        this.damage = PlayerEntity.base_damage;
        this.speed = PlayerEntity.base_speed;
        this.defense = PlayerEntity.base_defense;
        this.block_real = PlayerEntity.base_block;
        this.xp_multiplier = PlayerEntity.base_xp_multiplier;
        this.dash_cooldown_duration = PlayerEntity.base_dash_cooldown_duration;
        this.dash_speed = PlayerEntity.base_dash_speed;
        this.dash_active_duration = PlayerEntity.base_dash_active_duration;
        this.attack_cooldown_duration = PlayerEntity.base_attack_cooldown_duration;
        this.projectile_count = PlayerEntity.base_projectile_count;
        this.projectile_spread = PlayerEntity.base_projectile_spread;
        this.projectile_speed = PlayerEntity.base_projectile_speed;
        this.projectile_pierce = PlayerEntity.base_projectile_pierce;
        this.projectile_chain = PlayerEntity.base_projectile_chain;
        this.damage_min = PlayerEntity.base_damage_min;
        this.damage_max = PlayerEntity.base_damage_max;
        this.damage_multiplier = PlayerEntity.base_damage_multiplier;
        this.critical_chance = PlayerEntity.base_critical_chance;
        for (let i = 0; i < this.modifiers.length; i++) {
            const mod = this.modifiers[i];
            mod.mod_ref.callback(this, mod);
        }
        this.damage_min = Math.floor(this.damage_min * this.damage_multiplier);
        this.damage_max = Math.floor(this.damage_min * this.damage_multiplier);
        this.max_hp = Math.floor(this.max_hp * this.max_hp_multiplier);
        this.block_effective = clamp(this.block_real, 0, 0.9);
        this.defense = clamp(this.defense, 0, 1000);

    }

    __update_attack() {
        if (keys.mouse1 && this.attack_cooldown_timer == 0) {
            this.attack_cooldown_timer = this.attack_cooldown_duration;
            for (var i = 0; i < this.projectile_count; i++) {
                new ProjectileEntity(this);     
            }
        }
        this.attack_cooldown_timer = this.attack_cooldown_timer <= 0 ? 0 : this.attack_cooldown_timer-1;  
    }
    
    __update_dash() {
        if (keys.space && this.dash_isactive == false && this.dash_cooldown_timer <= 0) { 
            this.dash_cooldown_timer = this.dash_cooldown_duration;
            this.dash_active_timer = this.dash_active_duration;
            // Snapshot velocity for the dash
            this.dash_vx = this.ax * this.dash_speed;
            this.dash_vy = this.ay * this.dash_speed;
            this.vx += this.dash_vx;
            this.vy += this.dash_vy;
            this.dash_isactive = true;
        }
        if (this.dash_isactive == true && this.dash_active_timer <= 0) {
            // Deactivate dash
            this.vx -= this.dash_vx;
            this.vy -= this.dash_vy;
            this.dash_vx = 0;
            this.dash_vy = 0;
            this.dash_isactive = false;
        }
        this.dash_cooldown_timer = this.dash_cooldown_timer <= 0 ? 0 : this.dash_cooldown_timer-1;
        this.dash_active_timer = this.dash_active_timer <= 0 ? 0 : this.dash_active_timer-1;
    }
}