class IceCascadeEntity extends DurationEntity {

    static base_max_hp = 16;
    static base_damage_multiplier = 0.5;
    static models = [
        _load_image_asset("assets/ice_cascade00.png"),
        _load_image_asset("assets/ice_cascade01.png"),
        _load_image_asset("assets/ice_cascade02.png"),
        _load_image_asset("assets/ice_cascade03.png"),
        _load_image_asset("assets/ice_cascade04.png"),
        _load_image_asset("assets/ice_cascade05.png"),
        _load_image_asset("assets/ice_cascade06.png"),
        _load_image_asset("assets/ice_cascade07.png"),
    ]

    /* vx,vy - direction vector 
     * dist - distance from player's crosshair to spawn
    */
    constructor(player, vx, vy, dist, size) {
        const damage = Math.floor((Math.random()*(player.damage_max-player.damage_min) + player.damage_min) * IceCascadeEntity.base_damage_multiplier);
        const x = player.crosshair.x + vx * dist;
        const y = player.crosshair.y + vy * dist;
        super(x, y, 0, 0, player.ax, player.ay, size, 0, IceCascadeEntity.base_max_hp);
        this.player = player;
        this.damage = damage;
        this.is_crit = false;
        this.projectile_pierce_special = player.projectile_pierce_special;
        this.projectile_pierce = 0;
        this.entities_excluded_shiftable = false; // Allow this entity to interact with other entities again
        this.entities_excluded = [];
        this.is_inactive = false;
        this.animation_state = 0;
        this.model = IceCascadeEntity.models[0];
        this.animation_offsets = {
            2 : 1, 
            4 : 2, 
            6 : 3,
            8 : 4,
            10 : 5,
            12 : 6,
            14 : 7,
            16 : 0
        }
        this.animation_states = {
            0 : IceCascadeEntity.models[0],
            1 : IceCascadeEntity.models[1],
            2 : IceCascadeEntity.models[2],
            3 : IceCascadeEntity.models[3],
            4 : IceCascadeEntity.models[4],
            5 : IceCascadeEntity.models[5],
            6 : IceCascadeEntity.models[6],
            7 : IceCascadeEntity.models[7],
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
    }

    monster_hit() {
        // No special interaction with monster hits for this entity
        return;
    }
}
