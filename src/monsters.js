class MonsterEntity extends PhysicalEntity {
    constructor(size, max_hp, damage, speed, xp) {
        super(0, 0, 0, 0, 0, 0, size, true);
        this.max_hp = max_hp;
        this.hp = max_hp;
        this.model = undefined;
        this.hit_recently = 0;
        this.animation_state = 0;
        this.frame_alive = 0;
        this.damage = damage;
        this.speed = speed;
        this.xp = xp;
        this.model_hit = undefined; // TODO: replace with dev sprites
        this.animation_offsets = {
            0 : 0
        };
        this.animation_states = {
            0 : undefined,
        };

        this._random_spawn();
    }

    update() {
        super.update();

        // Animation state
        const anim_offset = this.frame_alive % 64;
        const next_animation_state = this.animation_offsets[anim_offset];
        if (next_animation_state != undefined) {
            this.animation_state = next_animation_state;
        }
        if (this.hit_recently > 0) {
            // Hit animation model has priority     
            this.model = this.model_hit;
            this.hit_recently -= 1;
        }
        else {
            // Set normal model based on current animation state
            this.model = this.animation_states[this.animation_state];
        }

        // TODO: fix bad movement logic
        // Unit vector towards player
        var uvec = normalize_vector(
            this.x - world.player.x, 
            this.y - world.player.y
        )

        // Try move straight, then 45 degrees left and right,
        // then finally 90 degrees left and right. This is probably not very
        // efficient or smart, but looks good enough.
        var candidate_moves = [
            uvec,
            rotate_vector(uvec.x, uvec.y, Math.PI/4),
            rotate_vector(uvec.x, uvec.y, -Math.PI/4),
            rotate_vector(uvec.x, uvec.y, Math.PI/2),
            rotate_vector(uvec.x, uvec.y, -Math.PI/2),
        ];

        var mx = this.x;
        var my = this.y;
        
        // Try moves and accept the first position that doesnt collide
        for (var move = 0; move < candidate_moves.length; move++) {
            var move_vec = candidate_moves[move]
            var new_x = this.x - move_vec.x * this.speed;
            var new_y = this.y - move_vec.y * this.speed;
            var collision_flag = false;
            for (var j = 0; j < world.monsters.length; j++) {
                const other_monster = world.monsters[j];
                if (other_monster.eid == this.eid) continue;   
                if (is_stuck(new_x, new_y, this.size, other_monster.x, other_monster.y, other_monster.size)) {
                    collision_flag = true;
                    break;
                }
            }
            if (!collision_flag) {
                // No collision, accept new position
                mx = new_x;
                my = new_y;
                break;
            }
        }
        this.x = mx;
        this.y = my
        this.frame_alive += 1;
    }

    take_damage(result_damage) {
        this.hp -= result_damage;
        this.hit_recently = 4;
        new DynamicTextEntity(this.x+30, this.y, 0, -2, 0, 0, 100, 60, 0.96, "#FFFFFF", result_damage);  
    }

    _random_spawn() {
        // This sets monster origin to random point around player
        const player = world.player;
        // 10 attempts to spawn without collision
        for (let i = 0; i < 10; i++) {
            var new_origin = normalize_vector(Math.random()-0.5, Math.random()-0.5);
            var collide = false;
            new_origin.x = new_origin.x * 1000 + player.x;
            new_origin.y = new_origin.y * 1000 + player.y;
            for (let j = 0; j < world.monsters.length; j++) {
                const monster = world.monsters[j];
                if (is_stuck(new_origin.x, new_origin.y, 100, monster.x, monster.y, monster.size)) {
                    collide = true;
                    break;
                }
            }
            if (!collide) {
                break;
            }
        }
        this.x = new_origin.x;
        this.y = new_origin.y;
    }
}

class HonzeekMonsterEntity extends MonsterEntity {

    static size = 60;
    static max_hp = 80;
    static damage = 10;
    static speed = 2.2;
    static xp = 300;
    static model_idle = _load_image_asset("https://cdn.discordapp.com/emojis/857700195689300008.webp");
    static model_hit = _load_image_asset("https://cdn.discordapp.com/attachments/749608248184799345/1004827766283309126/honzeek_hit.webp");

    constructor() {
        super(
            HonzeekMonsterEntity.size, 
            HonzeekMonsterEntity.max_hp, 
            HonzeekMonsterEntity.damage, 
            HonzeekMonsterEntity.speed, 
            HonzeekMonsterEntity.xp
        );
        this.model = HonzeekMonsterEntity.model_idle;
        this.model_hit = HonzeekMonsterEntity.model_hit;
        this.animation_offsets = {
            0 : 0
        };
        this.animation_states = {
            0 : HonzeekMonsterEntity.model_idle,
        };
    }
}


class MyregMonsterEntity extends MonsterEntity {

    static size = 60;
    static max_hp = 200;
    static damage = 40;
    static speed = 2;
    static xp = 600;
    
    static model_idle = _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804398619938917/frame_0_delay-0.1s.gif");
    static model_anim0 = _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804398900940890/frame_1_delay-0.1s.gif")
    static model_anim1 = _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804399303606282/frame_2_delay-0.1s.gif")
    static model_hit = _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1006979563500347412/myreg_hit.webp");

    constructor() {
        super(
            MyregMonsterEntity.size, 
            MyregMonsterEntity.max_hp, 
            MyregMonsterEntity.damage, 
            MyregMonsterEntity.speed, 
            MyregMonsterEntity.xp
        );
        this.model = MyregMonsterEntity.model_idle;
        this.model_hit = MyregMonsterEntity.model_hit;
        this.animation_offsets = {
            0 : 1,
            12 : 2,
            24 : 1,
            36 : 0,
        };
        this.animation_states = {
            0 : MyregMonsterEntity.model_idle,
            1 : MyregMonsterEntity.model_anim0,
            2 : MyregMonsterEntity.model_anim1,
        };
    }
}
