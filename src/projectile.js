class ProjectileEntity extends DurationEntity {

    static base_max_hp = 60;
    static models = [
        _load_image_asset("assets/proj00.png"),
        _load_image_asset("assets/proj01.png"),
        _load_image_asset("assets/proj02.png"),
        _load_image_asset("assets/proj03.png"),
        _load_image_asset("assets/proj04.png"),
        _load_image_asset("assets/proj05.png"),
    ]

    constructor(player) {
        const angle = (Math.random() - 0.5) * player.projectile_spread;
        const vec = rotate_vector(player.ax, player.ay, angle);
        const damage = Math.floor(Math.random()*(player.damage_max-player.damage_min) + player.damage_min);
        const is_crit = Math.random() < player.critical_chance ? 1 : 0;
        const x = player.crosshair.x;
        const y = player.crosshair.y;
        const vx = vec.x * player.projectile_speed;
        const vy = vec.y * player.projectile_speed;
        super(x, y, vx, vy, vec.x, vec.y, 32, 0, ProjectileEntity.base_max_hp);
        this.player = player;
        this.speed = player.projectile_speed;
        this.projectile_chain = player.projectile_chain;
        this.projectile_pierce = player.projectile_pierce;      
        this.damage = damage;
        this.is_crit = is_crit;
        this.entities_excluded = [];
        this.is_inactive = false;
        this.animation_state = 0;
        this.model = ProjectileEntity.models[0];
        this.animation_offsets = {
            2 : 1, 
            5 : 2, 
            8 : 3,
            11 : 4,
            14 : 5,
            17 : 0,
        }
        this.animation_states = {
            0 : ProjectileEntity.models[0],
            1 : ProjectileEntity.models[1],
            2 : ProjectileEntity.models[2],
            3 : ProjectileEntity.models[3],
            4 : ProjectileEntity.models[4],
            5 : ProjectileEntity.models[5],
        };
    }

    update() {
        super.update();
        // Animation state
        const anim_offset = this.frame_alive % 18;
        const next_animation_state = this.animation_offsets[anim_offset];
        if (next_animation_state != undefined) {
            this.animation_state = next_animation_state;
        }
        // Set normal model based on current animation state
        this.model = this.animation_states[this.animation_state];
        this.is_inactive = false; // Activate itself for chance to deal damage this tick if collides
    }

    monster_hit() {
        this.is_inactive = true;
        
        if (this.projectile_chain > 0) {
            const random_monster = world.monsters[
                Math.floor(Math.random() * world.monsters.length)
            ];
            var new_vec = normalize_vector(
                random_monster.x - this.x,
                random_monster.y - this.y,
            )
            this.vx = new_vec.x * this.speed;
            this.vy = new_vec.y * this.speed;
            this.hp = 60;
            this.projectile_chain--;
        }
        else if (this.projectile_pierce > 0) {
            // Projectile no longer chains, but can still pierce
            this.projectile_pierce--;
        }
        else {
            // Hit was final, kill projectile
            this.hp = 0;
        } 
    } 
}
