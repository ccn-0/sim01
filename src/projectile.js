class ProjectileEntity extends DurationEntity {

    static base_max_hp = 60;

    constructor(player) {
        const angle = (Math.random() - 0.5) * player.projectile_spread;
        const vec = rotate_vector(player.ax, player.ay, angle);
        const damage = Math.floor(Math.random()*(player.damage_max-player.damage_min) + player.damage_min);
        const is_crit = Math.random() < player.critical_chance ? 1 : 0;
        const x = player.crosshair.x;
        const y = player.crosshair.y;
        const vx = vec.x * player.projectile_speed;
        const vy = vec.y * player.projectile_speed;
        super(x, y, vx, vy, vec.x, vec.y, 7, ProjectileEntity.base_max_hp);
        this.player = player;
        this.speed = player.projectile_speed;
        this.projectile_chain = player.projectile_chain;
        this.projectile_pierce = player.projectile_pierce;
        this.damage = damage;
        this.is_crit = is_crit;
        this.entities_excluded = [];
        world.projectiles.push(this);
    }

    update() {
        super.update();
        // Check if some monster is hit
        for (var i = 0; i < world.monsters.length; i++) {
            var monster = world.monsters[i];
            
            if (monster.hp <= 0) {
                continue; // Something already killed the monster this frame, don't interact
            }
            
            var dist = Math.hypot(
                monster.x - this.x,
                monster.y - this.y
            );
            if (dist < (monster.size + this.size) * 0.5
                && !this.entities_excluded.includes(monster.eid)) {     
                // Simulate hit
                this.__projectile_hit(monster);
                break; // Projectile can hit at most 1 monster per frame
            }
        }
    }

    __projectile_hit(monster) {
        var result_damage = this.damage * (this.is_crit ? 2.0 : 1.0);
        monster.hp -= result_damage;
        monster.hit_recently = 4;  
        this.entities_excluded.push(monster.eid);

        // Monster died to this projectile
        if (monster.hp <= 0) {
            const result_xp = monster.xp * this.player.xp_multiplier;
            this.player.xp += result_xp;
            new DynamicTextEntity(monster.x-30, monster.y, 0, -2, 0, 0, 60, 60, 0.98, "#CCCC00", result_xp + " xp");
        }
    
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
        new DynamicTextEntity(monster.x+30, monster.y, 0, -2, 0, 0, 100, 60, 0.96, "#FFFFFF", result_damage);
    }
}

// function _make_projectile(spread, speed, damage_min, damage_max) {
//     var player = world.player;
//     var rand_angle = (Math.random() - 0.5) * spread;
//     var vel_x = Math.cos(rand_angle) * player.ax - Math.sin(rand_angle) * player.ay;
//     var vel_y = Math.sin(rand_angle) * player.ax + Math.cos(rand_angle) * player.ay;
//     var damage = Math.floor(Math.random()*(damage_max-damage_min) + damage_min);
//     var is_crit = Math.random() < player.critical_chance ? 1 : 0;
//     return {
//         'eid' : global_eid++,
//         'type' : "projectile",
//         'x' : player.x + player.ax*30,
//         'y' : player.y + player.ay*30,
//         'vx' : vel_x * speed,
//         'vy' : vel_y * speed,
//         'speed' : speed,
//         'projectile_chain' : player.projectile_chain,
//         'projectile_pierce' : player.projectile_pierce,
//         'entities_excluded' : [], // List of monsters projectile already hit (to prevent multiple hits in case of pierce/chain)
//         'size' : 7,
//         'color' : "#FFFFFF",
//         'hp' : 60,
//         'damage' : damage,
//         'is_crit' : is_crit,
//     }
// }