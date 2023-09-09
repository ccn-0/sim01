class PlasmaNovaEntity extends DurationEntity {

    static base_max_hp = 90;
    static base_damage_multiplier = 0.7;
    static models = [
        _load_image_asset("assets/plasma00.png"),
        _load_image_asset("assets/plasma01.png"),
        _load_image_asset("assets/plasma02.png"),
        _load_image_asset("assets/plasma03.png"),
    ]

    /* vx,vy - direction vector 
     * dist - distance from player's crosshair to spawn
    */
    constructor(player, vx, vy, size) {
        const damage = Math.floor((Math.random()*(player.damage_max-player.damage_min) + player.damage_min) * PlasmaNovaEntity.base_damage_multiplier);
        const x = player.crosshair.x;
        const y = player.crosshair.y;
        const nvx = vx * 20;
        const nvy = vy * 20;
        super(x, y, nvx, nvy, player.ax, player.ay, size, 0, PlasmaNovaEntity.base_max_hp);
        this.player = player;
        this.damage = damage;
        this.is_crit = false;
        this.projectile_pierce_special = player.projectile_pierce_special;
        this.projectile_pierce = 5;
        this.entities_excluded_shiftable = false; // Allow this entity to interact with other entities again?
        this.entities_excluded = [];
        this.is_inactive = false;
        this.animation_state = 0;
        this.model = PlasmaNovaEntity.models[0];
        this.animation_offsets = {
            4 : 1, 
            8 : 2, 
            12 : 3,
            16 : 0,
        }
        this.animation_states = {
            0 : PlasmaNovaEntity.models[0],
            1 : PlasmaNovaEntity.models[1],
            2 : PlasmaNovaEntity.models[2],
            3 : PlasmaNovaEntity.models[3],
        };
    }

    update() {
        super.update();
        // Animation state
        const anim_offset = this.frame_alive % 17;
        const next_animation_state = this.animation_offsets[anim_offset];
        if (next_animation_state != undefined) {
            this.animation_state = next_animation_state;
        }
        // Set normal model based on current animation state
        this.model = this.animation_states[this.animation_state];
        this.is_inactive = false;
    }

    monster_hit() {
        this.is_inactive = true;
        if (this.projectile_pierce > 0) {
            // Projectile no longer chains, but can still pierce
            this.projectile_pierce--;
        }
        else {
            // Hit was final, kill projectile
            this.hp = 0;
        } 
        return;
    }
}
